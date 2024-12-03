extends Control

@onready var input: TabContainer = %input

@onready var output: TextEdit = %output

func prepare_data():
  var text:String = input.get_current_tab_control().text
  var a0:Array[float] = []
  var a1:Array[float] = []
  for line:String in text.split("\n"):
    var lr = line.split_floats(" ")
    a0.append(lr[0])
    a1.append(lr[1])
  return [a0, a1]

func _on_btn_solve_1_pressed() -> void:
  var data = prepare_data()
  var a0:Array[float] = data[0]
  var a1:Array[float] = data[1]
  a0.sort()
  a1.sort()
  var sum:float = 0
  for i in range(len(a0)):
    sum += abs(a0[i] - a1[i])
  output.text += "puzzle 1: %d\n" % sum


func _on_btn_solve_2_pressed() -> void:
  var data = prepare_data()
  var a0:Array[float] = data[0]
  var a1:Array[float] = data[1]
  var sum:float = 0
  for n in a0:
    sum += n * a1.count(n)
  output.text += "puzzle 2: %d\n" % sum


func _on_btn_clear_pressed() -> void:
  output.text = ""
