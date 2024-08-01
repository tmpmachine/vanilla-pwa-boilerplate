# vanilla-pwa-boilerplate<br>



## Main Files

This is the main files that are required to build a PWA:

- index.html
- pwa-cacher.js<br>

- sw.js
- manifest-cache.json
- manifest.json

<!-- -->

Everything else on the repository is for running a local server for testing using Express. You can also run VS Code Live Server extension directly from the root directory.

## List Files to Cache<br>



`manifest-cache.json` contains a list of files to cache and the cache version to trigger auto-cache.

```json
{
  "version": 1,
  "root": [
    "./",
    "index.html",
    "manifest.json",
    "pwa-cacher.js"
  ]
}
```

To add a new group of files, add a key value of type array string. The key name is up to you. For example, here we add style and components files to cache.

`/manifest-cache.json`<br>

```json
{
  "version": 1,
  "style": [
    "css/style.css"
  ],
  "components": [
    "js/components/main-component.js",
    "js/components/file-explorer-component.js"
  ],
  "root": [
    "./",
    "index.html",
    "manifest.json",
    "pwa-cacher.js"
  ]
}
```

## Caching The Files

Make sure the PWA cacher utility is always accessible and working independently from the rest of your app components.

This will make sure your user have a way to clear the offline cache in case something went wrong. Otherwise you will need to provide a guide or link to guide on how to clear a site cache on their browser.

`/index.html`

```html
<!-- PWA cache manager -->
<h2>Updates & Offline Access</h2>
<div>
  <button data-action="pwaCacher.update" onclick="pwaCacher.Update()">Check for updates</button>
</div>
<label>
  <input name="replaceWidgetSettings" type="checkbox" oninput="pwaCacher.SetAutoCache(this.checked)" data-action="pwaCacher.autocache"/>
  Automatically download latest version.
</label>
<div>
  <b>Developer Settings:</b>
  <div>
    <label>
      <input name="replaceWidgetSettings" type="checkbox" oninput="pwaCacher.SetDevMode(this.checked)" data-action="pwaCacher.devmode"/>
      Disable offline caching.
    </label>
  </div>
</div>

<script src="pwa-cacher.js"></script>
<script>
  pwaCacher.Init();
</script>
```

