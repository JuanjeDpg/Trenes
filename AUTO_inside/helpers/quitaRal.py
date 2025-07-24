import pyautogui
import time
import acciones

x = 1460
y = 1000

color = acciones.colorPixel(x, y)
print(color)

print('Press Ctrl+C to quit.')
try:
    while color == [[76]]:
        time.sleep(0.5)
        pyautogui.moveTo(x, y)
        pyautogui.click()
except color != [[76]]:
    print('\n')