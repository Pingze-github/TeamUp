
editorKeyFuncs = {

  bind: function (obj) {
    // 为方法绑定对象
    for (var k of Object.keys(editorKeyFuncs)) {
      editorKeyFuncs[k] = editorKeyFuncs[k].bind(obj);
    }
  },

  delete_cur_line: function () {
    // 删除当前行
    var cursor = this.getCursor();
    this.setSelection({line: cursor.line-1, ch: 999999}, {line: cursor.line, ch: 999999});
    this.replaceSelection('');
    this.setCursor({line: cursor.line ? cursor.line-1 : 0, ch: 999999});
  },

  copy_cur_line: function () {
    // 复制当前行
    var cursor = mdEditor.getCursor();
    mdEditor.setSelection({line: cursor.line, ch: 0}, {line: cursor.line, ch: 999999});
    var curLineText = mdEditor.getSelection({line: cursor.line, ch: 0}, {line: cursor.line, ch: 999999});
    mdEditor.setSelection(cursor, cursor);
    mdEditor.insertValue('\n' + curLineText);
  },

  move_up_cur_line: function () {
    // 向上移动当前行
    var cursor = mdEditor.getCursor();
    mdEditor.setSelection({line: cursor.line-1, ch: 999999}, {line: cursor.line, ch: 999999});
    var curLineText = mdEditor.getSelection({line: cursor.line, ch: 0}, {line: cursor.line, ch: 999999});
    curLineText = curLineText.substr(1);
    mdEditor.replaceSelection('');
    mdEditor.setSelection(cursor, cursor);
    mdEditor.setCursor({ line: cursor.line ? cursor.line-1 : 0, ch: 0});
    mdEditor.insertValue(curLineText + '\n');
    mdEditor.setCursor({ line: cursor.line ? cursor.line-1 : 0, ch: cursor.ch});
  },

  move_down_cur_line: function () {
    // 向下移动当前行
    var cursor = mdEditor.getCursor();
    mdEditor.setSelection({line: cursor.line-1, ch: 999999}, {line: cursor.line, ch: 999999});
    var curLineText = mdEditor.getSelection({line: cursor.line, ch: 0}, {line: cursor.line, ch: 999999});
    curLineText = curLineText.substr(1);
    mdEditor.replaceSelection('');
    mdEditor.setSelection(cursor, cursor);
    mdEditor.setCursor({ line: cursor.line ? cursor.line+1 : 0, ch: 0});
    mdEditor.insertValue(curLineText + '\n');
    mdEditor.setCursor({ line: cursor.line ? cursor.line+1 : 0, ch: cursor.ch});
  }
};