import pyautogui
import cv2
import numpy as np

print("Posición del ratón:")
x, y = pyautogui.position()
print(x, y)

screenshot = pyautogui.screenshot(region=(x, y, 1, 1))
screenshot_np = np.array(screenshot)
screenshot_cv = cv2.cvtColor(screenshot_np, cv2.COLOR_RGB2BGR)
gris = cv2.cvtColor(screenshot_cv, cv2.COLOR_BGR2GRAY)

print("Gris\n", gris)

print("\nCon todos los [B G R] \n", screenshot_cv)

