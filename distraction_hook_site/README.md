# Distraction Hook — web documentation

A vanilla HTML/CSS/JavaScript reinterpretation of Misri Bhagat's 30-page process documentation.

## Files

- `index.html` — page structure and project copy
- `style.css` — layout, typography, colour and responsive styles
- `script.js` — scroll reveals, progress bar and the notification interaction
- `assets/` — images extracted from the supplied PDF

## Open locally

Double-click `index.html` or open it in a browser.

## Easy edits

### Text
Most project text is directly in `index.html`. Search for the section heading you want to change.

### Colours
At the top of `style.css`, edit the variables inside `:root`, especially:
- `--ink`
- `--paper`
- `--red`
- `--amber`

### Typography
Also in `:root`:
- `--sans`
- `--serif`
- `--mono`

### Images
All image references are inside `index.html` and point to files in `assets/`. Replace an asset with another image while keeping the filename, or change the `src` value.

### Notification interaction
The main interaction is in `script.js`, inside:
- `triggerNotification()`
- `resetNotification()`

The visual appearance of the phone and stand is in the `.hook-demo` rules in `style.css`.

## Source

Content and imagery were derived from:
`Misri_Bhagat_Final_Submission.pdf.pdf`
