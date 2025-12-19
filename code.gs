/**
 * === 基本設定 ===
 */
const SHEET_NAME = 'saves';

/**
 * Web App 入口
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('蜜桃快逃RPG')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 初始化 Spreadsheet
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'id',
      'slot_id',
      'current_scene',
      'current_page',
      'visited_scenes',
      'unlocked_endings',
      'is_dead',
      'saved_at'
    ]);
  }

  return sheet;
}

/**
 * 取得所有存檔（給 dataSdk.init 使用）
 */
function list() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  values.shift(); // remove header

  return values.map(row => ({
    id: row[0],
    slot_id: row[1],
    current_scene: row[2],
    current_page: row[3],
    visited_scenes: row[4],
    unlocked_endings: row[5],
    is_dead: row[6],
    saved_at: row[7]
  }));
}

/**
 * 新增存檔
 */
function create(data) {
  const sheet = getSheet();
  const id = Utilities.getUuid();

  sheet.appendRow([
    id,
    data.slot_id,
    data.current_scene,
    data.current_page,
    data.visited_scenes,
    data.unlocked_endings,
    data.is_dead,
    data.saved_at
  ]);

  return {
    isOk: true,
    id
  };
}

/**
 * 更新存檔
 */
function update(data) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.id) {
      sheet.getRange(i + 1, 2, 1, 7).setValues([[
        data.slot_id,
        data.current_scene,
        data.current_page,
        data.visited_scenes,
        data.unlocked_endings,
        data.is_dead,
        data.saved_at
      ]]);

      return { isOk: true };
    }
  }

  // 找不到就當新增
  return create(data);
}

/**
 * 刪除存檔
 */
function deleteSave(id) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { isOk: true };
    }
  }

  return { isOk: false };
}
