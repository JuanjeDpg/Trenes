import win32gui

def enum_win_titles():
    titles = []
    def callback(hwnd, titles):
        if win32gui.IsWindowVisible(hwnd):
            titles.append(win32gui.GetWindowText(hwnd))
        return True
    win32gui.EnumWindows(callback, titles)
    return titles

titles = enum_win_titles()
for i, title in enumerate(titles):
    print(f"{i}: {title}")