const WEBSOCKET_HOST = process.env.NODE_ENV === ‘production’
                         ? ‘wss://<YOUR_SERVER_SITE>/cable’
                         : ‘ws:"//localhost:3000/cable";


                         export default function RepairTrackingSubscription(
                           repairId,
                           { onUpdate = () => {} } = {}
                         ) {
