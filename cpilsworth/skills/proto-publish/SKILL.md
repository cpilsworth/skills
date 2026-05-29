---
name: proto-publish
description: >-
  Publish HTML files, presentations, or static sites to proto.adobe.io for instant
  shareable links. Use when the user asks to share a presentation, host a prototype,
  publish HTML, deploy a static site, get a public link for a deck, upload to Proto,
  or share something they've built. Handles single HTML files, folders, and zip files.
  Supports renaming prototypes after upload.
---

# Proto Publish

Upload static HTML content to [proto.adobe.io](https://proto.adobe.io) and get an instant shareable public link. Works with single HTML files, folders with an `index.html`, or zip archives.

## Prerequisites

- The user must be signed in to proto.adobe.io (Adobe IMS session)
- A proto.adobe.io tab should be open (or will be opened)

## Workflow

### 1. Open Proto

Navigate to proto.adobe.io:

```javascript
// Open or find existing Proto tab
// Look for tabs with proto.adobe.io
```

### 2. Prepare the file

Proto accepts:
- A single `index.html` file (or any `.html` file)
- A `.zip` archive containing a static site with `index.html` at root
- A folder with `index.html`

**Limits:**
- Max 100 MB upload size
- Max 500 files
- Must contain an `index.html` at the root level

If the source is a `.shtml` sprinkle or named differently, copy/rename it to `index.html` first.

### 3. Upload via file input

Proto's upload is driven by a hidden file input. The process:

1. Read/encode the file content as base64
2. Chunk the base64 into the browser (max ~20KB per eval to avoid timeout)
3. Decode, create a File object, and set it on the input

```javascript
// Chunk 1: Store base64 data
window.__fileChunks = '<base64_chunk_1>';

// Chunk N: Append
window.__fileChunks += '<base64_chunk_n>';

// Final: Decode and trigger upload
var b64 = window.__fileChunks;
var binary = atob(b64);
var bytes = new Uint8Array(binary.length);
for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
var blob = new Blob([bytes], {type: 'text/html'});
var file = new File([blob], 'index.html', {type: 'text/html'});

var input = document.querySelector('input[type=file]');
var dt = new DataTransfer();
dt.items.add(file);
input.files = dt.files;
input.dispatchEvent(new Event('change', {bubbles: true}));
```

For zip files, use `{type: 'application/zip'}` and name accordingly.

### 4. Wait for upload completion

After triggering the file input change, Proto processes and uploads. Wait 2-3 seconds then check for success:

```javascript
// Look for success heading and the generated URL
var heading = document.querySelector('h1, h2');
// heading.textContent should be "Success!"
var urlInput = document.querySelector('input[aria-label="Prototype URL"], input[value*="proto.adobe.io/"]');
// urlInput.value contains the shareable link
```

The page will show:
- "Success!" heading
- A textbox with the prototype URL (e.g. `https://proto.adobe.io/RandomGeneratedName`)
- Buttons: Copy URL, Rename prototype, Open prototype, Manage

### 5. Rename to something relevant

Proto generates a random name (e.g. `CharmedBrownTorch`). Rename it:

1. Navigate to the manage page: `https://proto.adobe.io/{currentName}/manage`
2. Find and click the edit button next to the `<h1>` heading:
   ```javascript
   var h1 = document.querySelector('h1');
   var editBtn = h1.nextElementSibling;
   editBtn.click();
   ```
3. Wait for the rename dialog to appear (`[role=dialog]`)
4. Set the new name on the second input using React-compatible value setting:
   ```javascript
   var dialog = document.querySelector('[role=dialog]');
   var inputs = dialog.querySelectorAll('input');
   var newInput = inputs[1]; // Second input is the "New" name field
   
   var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
     window.HTMLInputElement.prototype, 'value'
   ).set;
   nativeInputValueSetter.call(newInput, 'desired-name');
   newInput.dispatchEvent(new Event('input', {bubbles: true}));
   newInput.dispatchEvent(new Event('change', {bubbles: true}));
   ```
5. Click Save:
   ```javascript
   var saveBtn = [...dialog.querySelectorAll('button')].find(
     b => b.textContent.trim() === 'Save'
   );
   saveBtn.click();
   ```
6. Confirm by checking the URL changed to `proto.adobe.io/{new-name}/manage`

### Naming conventions

Generate names that are:
- Lowercase with hyphens (URL-safe)
- Prefixed with the user's identifier if requested
- Descriptive of the content (e.g. `chrisp-agent-skills`, `q3-review-deck`, `product-launch-2026`)
- Short enough to share verbally (~3-4 words max)

## Full example: Publishing a presentation

```bash
# 1. Ensure content exists
cat /shared/sprinkles/my-deck/my-deck.shtml | wc -c

# 2. Base64 encode
cat /shared/sprinkles/my-deck/my-deck.shtml | base64 -w 0 > /tmp/deck-b64.txt

# 3. Open proto.adobe.io tab (or find existing)
# 4. Chunk the base64 into the browser (~20KB chunks)
# 5. Assemble and trigger upload
# 6. Wait for success
# 7. Navigate to manage page
# 8. Rename to desired slug
# 9. Report final URL to user
```

## Updating an existing prototype

Navigate to `https://proto.adobe.io/{name}/manage` and use the "Update prototype" section which has its own file input (`Choose file` / `Choose folder` buttons). Same upload technique applies.

## Visibility

Prototypes are **public by default**  anyone with the link can view. To change:
- Find the "Prototype visibility" button on the manage page
- Toggle between Public and Private

## Troubleshooting

| Issue | Solution |
|---|---|
| "no index.html in upload" | Ensure the file is named `index.html` |
| Upload timeout | Check file size < 100MB, file count < 500 |
| Rename dialog doesn't appear | Wait 500ms after clicking the edit icon; the dialog has an open animation |
| React input not taking value | Always use `nativeInputValueSetter` pattern, not direct `.value =` |
| "project not found" on manage URL | The name may have changed; go to proto.adobe.io home and find it in "My prototypes" |

## Don't

- Don't upload files larger than 100MB or with more than 500 files.
- Don't assume the random name  always read it from the success page URL input.
- Don't skip the `nativeInputValueSetter` pattern for React inputs  direct assignment won't trigger state updates.
- Don't forget the 500ms delay before interacting with the rename dialog  it has a CSS open transition.
