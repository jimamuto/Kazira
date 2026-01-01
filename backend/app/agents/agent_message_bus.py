import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

class AgentMessage:
    """
    Represents a message passed between agents.
    """
    def __init__(
        self,
        from_agent: str,
        to_agent: str,
        message_type: str,
        data: Dict[str, Any],
        priority: str = "NORMAL"
    ):
        self.from_agent = from_agent
        self.to_agent = to_agent
        self.message_type = message_type
        self.data = data
        self.priority = priority  # NORMAL, URGENT, CRITICAL
        self.timestamp = datetime.now().isoformat()

class AgentMessageBus:
    """
    Enables dynamic agent-to-agent communication for emergent behavior.
    
    Allows agents to:
    - Send urgent messages that override normal sequence
    - Negotiate and collaborate
    - Trigger each other based on real-time data
    """
    
    def __init__(self):
        self.message_queue = asyncio.Queue()
        self.message_history: List[AgentMessage] = []
        self.subscribers: Dict[str, List] = {}
    
    async def send_message(
        self,
        from_agent: str,
        to_agent: str,
        message_type: str,
        data: Dict[str, Any],
        priority: str = "NORMAL"
    ):
        """
        Send a message to another agent.
        
        Priority levels:
        - NORMAL: Standard agent communication
        - URGENT: Requires immediate attention
        - CRITICAL: Overrides all normal operations
        """
        message = AgentMessage(from_agent, to_agent, message_type, data, priority)
        
        # Store in history
        self.message_history.append(message)
        
        # Add to queue
        await self.message_queue.put(message)
        
        # Log based on priority
        if priority == "CRITICAL":
            logging.critical(f"[MessageBus] CRITICAL from {from_agent} to {to_agent}: {message_type}")
        elif priority == "URGENT":
            logging.warning(f"[MessageBus] URGENT from {from_agent} to {to_agent}: {message_type}")
        else:
            logging.info(f"[MessageBus] {from_agent} -> {to_agent}: {message_type}")
    
    async def start_router(self):
        """
        Starts the message router that distributes messages to agents.
        This runs continuously as a background task.
        """
        logging.info("[MessageBus] Starting message router...")
        
        while True:
            try:
                message = await asyncio.wait_for(
                    self.message_queue.get(),
                    timeout=1.0
                )
                
                # Route to subscriber
                if message.to_agent in self.subscribers:
                    callback = self.subscribers[message.to_agent]
                    await callback(message)
                else:
                    logging.warning(f"[MessageBus] No subscriber for {message.to_agent}")
                
                # Handle URGENT messages with immediate action
                if message.priority == "URGENT":
                    await self._handle_urgent_message(message)
                elif message.priority == "CRITICAL":
                    await self._handle_critical_message(message)
                
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logging.error(f"[MessageBus] Error routing message: {e}")
    
    def subscribe(self, agent_name: str, callback):
        """
        Subscribe an agent to receive messages.
        """
        self.subscribers[agent_name] = callback
        logging.info(f"[MessageBus] {agent_name} subscribed to message bus")
    
    async def _handle_urgent_message(self, message: AgentMessage):
        """
        Handles URGENT messages that require immediate action.
        """
        logging.warning(f"[MessageBus] Handling URGENT message: {message.message_type}")
        
        # Log for orchestrator to pick up
        urgent_log = {
            "type": "URGENT_ALERT",
            "from": message.from_agent,
            "message": message.message_type,
            "data": message.data,
            "timestamp": message.timestamp
        }
        
        # In production, this would trigger orchestrator intervention
        # For now, we just log it prominently
        print(f"\n{'='*60}")
        print(f"🚨 URGENT MESSAGE 🚨")
        print(f"From: {message.from_agent}")
        print(f"Type: {message.message_type}")
        print(f"Data: {message.data}")
        print(f"{'='*60}\n")
    
    async def _handle_critical_message(self, message: AgentMessage):
        """
        Handles CRITICAL messages that override all operations.
        """
        logging.critical(f"[MessageBus] Handling CRITICAL message: {message.message_type}")
        
        # Critical messages may require immediate orchestration changes
        critical_log = {
            "type": "CRITICAL_OVERRIDE",
            "from": message.from_agent,
            "message": message.message_type,
            "data": message.data,
            "timestamp": message.timestamp
        }
        
        print(f"\n{'='*60}")
        print(f"🔴 CRITICAL OVERRIDE 🔴")
        print(f"From: {message.from_agent}")
        print(f"Type: {message.message_type}")
        print(f"Data: {message.data}")
        print(f"{'='*60}\n")
    
    def get_recent_messages(self, limit: int = 10) -> List[AgentMessage]:
        """
        Get the most recent messages from the history.
        """
        return self.message_history[-limit:]
    
    def get_messages_by_type(self, message_type: str) -> List[AgentMessage]:
        """
        Get all messages of a specific type.
        """
        return [m for m in self.message_history if m.message_type == message_type]
