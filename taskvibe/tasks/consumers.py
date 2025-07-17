import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Challenge, Task, User
from .notifications import send_challenge_update

class ChallengeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.group_name = f'challenge_{self.group_id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        challenge_id = data['challenge_id']
        user_id = data['user_id']

        challenge = await database_sync_to_async(Challenge.objects.get)(id=challenge_id)
        user = await database_sync_to_async(User.objects.get)(id=user_id)
        completed_tasks = await database_sync_to_async(Task.objects.filter)(
            user_id=user_id,
            completed=True,
            created_at__gte=challenge.created_at,
            created_at__lte=challenge.deadline
        ).count()

        await database_sync_to_async(send_challenge_update)(challenge, user)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'challenge_update',
                'message': {
                    'user_id': user_id,
                    'completed_tasks': completed_tasks,
                }
            }
        )

    async def challenge_update(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))