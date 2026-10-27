// Paste into the "Forth Studios — Email Signups" sheet: Extensions → Apps Script.
// Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
// Put the resulting /exec URL in VITE_SIGNUP_SHEET_URL.
function doPost(e) {
  var data = JSON.parse(e.postData.contents || "{}");
  var email = String(data.email || "").trim().slice(0, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return ContentService.createTextOutput("invalid");
  }
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    new Date(),
    email,
    String(data.source || "").slice(0, 100),
    String(data.page || "").slice(0, 300),
    String(data.name || "").slice(0, 100),
  ]);
  return ContentService.createTextOutput("ok");
}
