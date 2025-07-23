# ------------------------------------------------------------------------------
# Generador de JSON de descripcion de estacion
# ------------------------------------------------------------------------------

import tkinter as tk
from tkinter import simpledialog, messagebox, filedialog
import json

# Diccionarios
buttons_data = []
cv_track_data = []
signal_data = []

# Modo de dibujo (Soportados: CV, señal estandar y señal de retroceso)
dmode = "cv"   # "cv" o "signal" o "cv_track"

# Selector de modo
def drawmode(sel_mode):
    global dmode
    dmode = sel_mode
    messagebox.showinfo("Modo", f"El modo seleccionado es {sel_mode}")

# Configuracion basica en arranque
root = tk.Tk()
root.withdraw()

sta_id = simpledialog.askstring("ID estacion", "Indroduce el ID de la estacion tal y como se define en SIMBOOL")
sta_name = simpledialog.askstring("Nombre estacion", "Introduce el nombre de la estacion en mayusculas")

if sta_id and sta_name:
    json_data = [
        { "id": sta_id, "label": sta_name, "type": "estacion" }
    ]
else:
    messagebox.showerror("Error", "Parametros de la estacion no ingresados")
    root.quit()

#root.deiconify()
root.destroy()

# Callback
def on_click(event):
    x, y = event.x, event.y
    if dmode == "cv":
        btn_width = simpledialog.askstring("Ancho del CV", "Como referencia, un ancho estandar es de 100px")
        if btn_width is not None:   # Para no generar basura en caso de cancelar
            btn_height = simpledialog.askstring("Alto del CV", "Como referencia, un alto estandar es de 30px")
            if btn_height is not None:
                btn_id = simpledialog.askstring("ID del CV", "Introduce el ID del CV (ej: CV1):\nNota: Debe ser el nombre EXACTO del simbool")
                if btn_id is not None:
                    bg_color = messagebox.askyesno("Color CV", "¿Es un CV señalizado?")
                    if bg_color is True:
                        background = "yellow"
                    else:
                        background = "red"

                    # Conversion para canvas, en JSON permite declaracion como string literal
                    width = int(btn_width)
                    height = int(btn_height)
                    if btn_id:
                        new_button = {
                            "id": btn_id,
                            "label": btn_id,
                            "style": f"background-color: {background}; position: absolute; top: {y}px; left: {x}px; width: {btn_width}px; height: {btn_height}px;",
                            "type": "cv"
                        }
                        buttons_data.append(new_button)
                        canvas.create_rectangle(x, y, x+width, y+height, fill=background)
                        canvas.create_text(x+(width/2), y+(height/2), text=btn_id, fill="black")

    elif dmode == "cv_track":
        track_width = simpledialog.askstring("Ancho del CV", "Como referencia, un ancho estandar es de 100px")
        if track_width is not None:   # Para no generar basura en caso de cancelar
            track_height = simpledialog.askstring("Alto del CV", "Como referencia, un alto estandar es de 30px")
            if track_height is not None:
                track_id = simpledialog.askstring("ID del CV", "Introduce el ID del CV (ej: CV1):\nNota: Debe ser el nombre EXACTO del simbool")
                if track_id is not None:
                    bg_track_color = messagebox.askyesno("Color CV", "¿Es un CV señalizado?")
                    if bg_track_color is True:
                        tbackground = "orange"
                    else:
                        tbackground = "red"

                    # Conversion para canvas, en JSON permite declaracion como string literal
                    twidth = int(track_width)
                    theight = int(track_height)
                    if track_id:
                        new_track = {
                            "id": track_id,
                            "label": track_id,
                            "style": f"background-color: {tbackground}; position: absolute; top: {y}px; left: {x}px; width: {track_width}px; height: {track_height}px;",
                            "type": "track"
                        }
                        cv_track_data.append(new_track)
                        canvas.create_rectangle(x, y, x+twidth, y+theight, fill=tbackground)
                        canvas.create_text(x+(twidth/2), y+(theight/2), text=track_id, fill="black")

    elif dmode == "signal":
        signal_s_id = simpledialog.askstring("ID de la señal", "Introduce el ID de la señal (ej: S1_2):\nNota: Debe ser el nombre EXACTO del simbool")
        if signal_s_id:
            new_signal = {
                "id": signal_s_id,
                "label": signal_s_id,
                "style": f"background-color: white; position: absolute; top: {y}px; left: {x}px; width: 50px; height: 30px;",
                "type": "signal"
            }
            signal_data.append(new_signal)
            canvas.create_rectangle(x, y, x+40, y+20, fill="white")
            canvas.create_text(x+20, y+10, text=signal_s_id, fill="black")

# JSON
def save_json():
    export_data = json_data.copy()
    for button in buttons_data:
        export_data.append ({
            "id": button["id"],
            "label": button["label"],
            "style": button["style"],
            "type": button["type"]
        })
    for track in cv_track_data:
        export_data.append ({
            "id": track["id"],
            "label": track["label"],
            "style": track["style"],
            "type": track["type"]
        })
    for ssignal in signal_data:
        export_data.append ({
            "id": ssignal["id"],
            "label": ssignal["label"],
            "style": ssignal["style"],
            "type": ssignal["type"]
        })

    file_path = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON files", "*.json")])
    if file_path:
        with open(file_path, "w") as f:
            json.dump(export_data, f, indent=2)
        messagebox.showinfo("Exportado", f"Archivo guardado en:\n{file_path}")

# Interfaz
root = tk.Tk()
root.title("Descriptor de estacion")
root.geometry("800x600")

canvas = tk.Canvas(root, bg="white")
canvas.grid(row=0, column=1, rowspan=4, sticky="nsew")
canvas.bind("<Button-1>", on_click)

save_btn = tk.Button(root, text="Guardar JSON", command=save_json)
save_btn.grid(row=0, column=0, padx=5, pady=5)

cv_btn = tk.Button(root, text="CV's", command=lambda: drawmode("cv"))
cv_btn.grid(row=1, column=0, padx=5, pady=5)

cv_track = tk.Button(root, text="CV especial", command=lambda: drawmode("cv_track"))
cv_track.grid(row=2, column=0, padx=5, pady=5)

signal_btn = tk.Button(root, text="Señal", command=lambda: drawmode("signal"))
signal_btn.grid(row=3, column=0, padx=5, pady=5)

root.grid_rowconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.grid_rowconfigure(2, weight=1)
root.grid_rowconfigure(3, weight=1)
root.grid_columnconfigure(1, weight=1)

root.mainloop()

root.mainloop()



