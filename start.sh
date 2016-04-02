# $(logname) === current user

# run server
osascript -e 'tell application "Terminal" to do script "cd Sites/as-if/ && npm run dev"'

sleep 15

# run browser in kiosk mode
osascript scripts/kiosk.scpt
