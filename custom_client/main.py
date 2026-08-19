import asyncio
from framework import CustomClientBase
from user_window import mainloop

# Websocket URL
url = 'wss://supertanks-app-production-eu.herokuapp.com/'

# Get login token
token = open('token.txt').read().strip()


class VisualClient(CustomClientBase):
    async def on_bootstrap_complete(self):
        print(f'Connected as {self.name} (tankID={self.state.tankID})')


async def main():
    client = VisualClient(url=url, name='Omena0', session_cookie=token)
    await client.run_with_ui(mainloop)

asyncio.run(main())
