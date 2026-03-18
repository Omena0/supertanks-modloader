from state import GlobalState
from typing import Callable
import websockets
import asyncio
import pygame
import sys
import math
import time

pygame.init()

clock = pygame.time.Clock()

def tank_triangle_points(x: float, y: float, angle: float, length: float = 14, width: float = 9):
    # Front tip points along heading; rear corners are offset by +/- 90 degrees.
    front = (x + math.cos(angle) * length, y + math.sin(angle) * length)
    rear_center = (x - math.cos(angle) * (length * 0.55), y - math.sin(angle) * (length * 0.55))
    left = (
        rear_center[0] + math.cos(angle + math.pi / 2) * (width / 2),
        rear_center[1] + math.sin(angle + math.pi / 2) * (width / 2),
    )
    right = (
        rear_center[0] + math.cos(angle - math.pi / 2) * (width / 2),
        rear_center[1] + math.sin(angle - math.pi / 2) * (width / 2),
    )
    return [front, left, right]

font = pygame.font.SysFont(None, size=20)


def world_scale(state: GlobalState, disp_w: int, disp_h: int) -> float:
    # Default fallback if maze metadata is not yet available.
    fallback = 1 / 2.65
    if not hasattr(state, 'map'):
        return fallback

    cells_across = getattr(state.map, 'cellsAcross', 0)
    cells_down = getattr(state.map, 'cellsDown', 0)
    if not cells_across or not cells_down:
        return fallback

    world_w = cells_across * 100
    world_h = cells_down * 100
    if world_w <= 0 or world_h <= 0:
        return fallback

    return min(disp_w / world_w, disp_h / world_h)

def draw_maze(disp: pygame.Surface, state: GlobalState, scale: float):
    if not hasattr(state, 'map'):
        return

    cells_across = getattr(state.map, 'cellsAcross', 0)
    cells_down = getattr(state.map, 'cellsDown', 0)
    vertical = getattr(state.map, 'verticalWalls', [])
    horizontal = getattr(state.map, 'horisontalWalls', [])
    corners = getattr(state.map, 'wallCorners', [])

    if not cells_across or not cells_down:
        return
    if not isinstance(vertical, list) or not isinstance(horizontal, list):
        return

    wall_color = (130, 130, 130)
    corner_color = (130, 130, 130)
    wall_thickness = max(2, int(10 * scale))
    corner_size = max(2, int(10 * scale))
    cell = 100

    # Vertical walls: cellsDown x (cellsAcross + 1)
    for row in range(cells_down):
        row_offset = row * (cells_across + 1)
        for col in range(cells_across + 1):
            i = row_offset + col
            if i >= len(vertical) or not vertical[i]:
                continue

            x = int(col * cell * scale)
            y0 = int(row * cell * scale)
            y1 = int((row + 1) * cell * scale)
            pygame.draw.line(disp, wall_color, (x, y0), (x, y1), wall_thickness)

    # Horizontal walls: (cellsDown + 1) x cellsAcross
    for row in range(cells_down + 1):
        row_offset = row * cells_across
        for col in range(cells_across):
            i = row_offset + col
            if i >= len(horizontal) or not horizontal[i]:
                continue

            y = int(row * cell * scale)
            x0 = int(col * cell * scale)
            x1 = int((col + 1) * cell * scale)
            pygame.draw.line(disp, wall_color, (x0, y), (x1, y), wall_thickness)

    # Optional corner posts for nicer junctions.
    if isinstance(corners, list):
        for row in range(cells_down + 1):
            row_offset = row * (cells_across + 1)
            for col in range(cells_across + 1):
                i = row_offset + col
                if i >= len(corners) or not corners[i]:
                    continue

                x = int(col * cell * scale - corner_size // 2)
                y = int(row * cell * scale - corner_size // 2)
                pygame.draw.rect(disp, corner_color, (x, y, corner_size, corner_size))

def _clamp(v: float, lo: float, hi: float) -> float:
    return lo if v < lo else hi if v > hi else v

def _circle_hits_vertical_wall(x: float, y: float, radius: float, wall_x: float, y0: float, y1: float, half_thickness: float) -> bool:
    nearest_y = _clamp(y, y0, y1)
    dx = abs(x - wall_x)
    dy = abs(y - nearest_y)
    return (dx * dx + dy * dy) <= (radius + half_thickness) ** 2

def _circle_hits_horizontal_wall(x: float, y: float, radius: float, x0: float, x1: float, wall_y: float, half_thickness: float) -> bool:
    nearest_x = _clamp(x, x0, x1)
    dx = abs(x - nearest_x)
    dy = abs(y - wall_y)
    return (dx * dx + dy * dy) <= (radius + half_thickness) ** 2

def collides_with_maze(state: GlobalState, x: float, y: float, radius: float) -> bool:
    if not hasattr(state, 'map'):
        return False

    cells_across = getattr(state.map, 'cellsAcross', 0)
    cells_down = getattr(state.map, 'cellsDown', 0)
    vertical = getattr(state.map, 'verticalWalls', [])
    horizontal = getattr(state.map, 'horisontalWalls', [])
    corners = getattr(state.map, 'wallCorners', [])
    if not cells_across or not cells_down:
        return False

    if not isinstance(vertical, list) or not isinstance(horizontal, list):
        return False

    cell = 100.0
    wall_half = 5.0

    col_center = int(x // cell)
    row_center = int(y // cell)

    row_min = max(0, row_center - 2)
    row_max = min(cells_down - 1, row_center + 2)
    col_min_v = max(0, col_center - 2)
    col_max_v = min(cells_across, col_center + 2)

    for row in range(row_min, row_max + 1):
        row_offset = row * (cells_across + 1)
        for col in range(col_min_v, col_max_v + 1):
            i = row_offset + col
            if i >= len(vertical) or not vertical[i]:
                continue
            wall_x = col * cell
            y0 = row * cell
            y1 = (row + 1) * cell
            if _circle_hits_vertical_wall(x, y, radius, wall_x, y0, y1, wall_half):
                return True

    row_min_h = max(0, row_center - 2)
    row_max_h = min(cells_down, row_center + 2)
    col_min_h = max(0, col_center - 2)
    col_max_h = min(cells_across - 1, col_center + 2)

    for row in range(row_min_h, row_max_h + 1):
        row_offset = row * cells_across
        for col in range(col_min_h, col_max_h + 1):
            i = row_offset + col
            if i >= len(horizontal) or not horizontal[i]:
                continue
            wall_y = row * cell
            x0 = col * cell
            x1 = (col + 1) * cell
            if _circle_hits_horizontal_wall(x, y, radius, x0, x1, wall_y, wall_half):
                return True

    if isinstance(corners, list):
        row_min_c = max(0, row_center - 2)
        row_max_c = min(cells_down, row_center + 2)
        col_min_c = max(0, col_center - 2)
        col_max_c = min(cells_across, col_center + 2)
        corner_half = 5.0

        for row in range(row_min_c, row_max_c + 1):
            row_offset = row * (cells_across + 1)
            for col in range(col_min_c, col_max_c + 1):
                i = row_offset + col
                if i >= len(corners) or not corners[i]:
                    continue

                cx = col * cell
                cy = row * cell
                nearest_x = _clamp(x, cx - corner_half, cx + corner_half)
                nearest_y = _clamp(y, cy - corner_half, cy + corner_half)
                dx = x - nearest_x
                dy = y - nearest_y
                if (dx * dx + dy * dy) <= radius * radius:
                    return True

    return False

def world_size(state: GlobalState) -> tuple[float, float]:
    if not hasattr(state, 'map'):
        return (0.0, 0.0)
    cells_across = getattr(state.map, 'cellsAcross', 0)
    cells_down = getattr(state.map, 'cellsDown', 0)
    return (float(cells_across * 100), float(cells_down * 100))

def predict_bullet_position(state: GlobalState, bullet: dict, dt_ms: float, radius: float = 5.0) -> tuple[float, float]:
    x = float(bullet.get('x', 0.0))
    y = float(bullet.get('y', 0.0))
    vx = float(bullet.get('vx', 0.0))
    vy = float(bullet.get('vy', 0.0))

    world_w, world_h = world_size(state)
    if world_w <= 0 or world_h <= 0:
        return (x + vx * dt_ms, y + vy * dt_ms)

    # Cap prediction horizon so temporary stalls don't fling bullets too far.
    remaining = max(0.0, min(dt_ms, 250.0))
    step_ms = 8.0

    while remaining > 0.0:
        step = step_ms if remaining > step_ms else remaining
        remaining -= step

        nx = x + vx * step
        ny = y + vy * step

        # Bounce off world bounds first.
        if nx - radius < 0:
            nx = radius
            vx = abs(vx)
        elif nx + radius > world_w:
            nx = world_w - radius
            vx = -abs(vx)

        if ny - radius < 0:
            ny = radius
            vy = abs(vy)
        elif ny + radius > world_h:
            ny = world_h - radius
            vy = -abs(vy)

        # Maze collision response by axis probing.
        coll_both = collides_with_maze(state, nx, ny, radius)
        if coll_both:
            coll_x = collides_with_maze(state, nx, y, radius)
            coll_y = collides_with_maze(state, x, ny, radius)

            if coll_x:
                vx = -vx
            if coll_y:
                vy = -vy
            if not coll_x and not coll_y:
                vx = -vx
                vy = -vy

            nx = x + vx * step
            ny = y + vy * step

            # If still colliding after reflection, keep previous position for this micro-step.
            if collides_with_maze(state, nx, ny, radius):
                nx = x
                ny = y

        x, y = nx, ny

    return (x, y)

async def mainloop(state: GlobalState):
    disp = pygame.display.set_mode((600, 600))

    running = True
    while running:
        # Events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                break

        # Draw
        disp.fill((60,60,60))
        scale = world_scale(state, disp.get_width(), disp.get_height())

        draw_maze(disp, state, scale)

        # Draw tanks
        for tank in state.tanks:
            x = tank.get('x')
            y = tank.get('y')
            if x is None or y is None:
                continue

            draw_x = x * scale
            draw_y = y * scale
            angle = float(tank.get('angle', 0.0))
            points = tank_triangle_points(draw_x, draw_y, angle)
            pygame.draw.polygon(disp, (255, 255, 255), points)

            # Draw name
            text = font.render(tank.get('name', ''), True, (255,255,255))
            disp.blit(text, (draw_x-5-text.get_width()//2, draw_y-10))

        # Draw bullets (predicted between sync packets, including bounce response)
        dt_ms = (time.monotonic() - state.lastBulletSyncTime) * 1000
        for bullet in state.bullets:
            x = bullet.get('x')
            y = bullet.get('y')
            if x is None or y is None:
                continue

            px, py = predict_bullet_position(state, bullet, dt_ms)
            draw_x = int(px * scale)
            draw_y = int(py * scale)
            pygame.draw.circle(disp, (235, 210, 110), (draw_x, draw_y), max(2, int(5 * scale)))

        pygame.display.flip()

        # use asyncio.sleep instead of clock.tick to avoid blocking the event loop
        await asyncio.sleep(1/60)

