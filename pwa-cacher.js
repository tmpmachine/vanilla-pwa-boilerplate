let pwaCacher = (function() {
  
  let $ = document.querySelector.bind(document);
  let cacheName = 'appcache-boilerplate-NDcwNzM0NzA';
  let manifestCachePath = './manifest-cache.json';
  
  let SELF = {
    Update,
    SetAutoCache,
    SetDevMode,
    Init,
  };
  
  let data = {
    cacheVersion: 1.0, // see manifest-cache.json
    isDevMode: false,
    isAutoCache: true,
  };
  
  let local = {
    componentStorageKey: `${cacheName}-settings`,
    defaultDataJSON: JSON.stringify(data),
  };
  
  function save() {
    localStorage.setItem(local.componentStorageKey, JSON.stringify(data));
  }
  
  async function SetDevMode(isChecked) {
    
    if (isChecked) {
      let isConfirm = window.confirm('This will clear offline cache. Continue?');
      if (!isConfirm) {
        refreshSettingsState();
        return;
      }
      
      await removeCache();
    }
    
    data.isDevMode = isChecked;
    refreshSettingsState();
    save();
  }
  
  function SetAutoCache(isChecked) {
    data.isAutoCache = isChecked;
    refreshSettingsState();
    save();
  }
  
  function extractUrlsFromJson(json) {
    let urls = [];
    for (let key in json) {
      if (Array.isArray(json[key])) {
        urls = urls.concat(json[key]);
      }
    }
    return urls;
  }
    
  async function removeCache() {
    let cacheNames = await caches.keys();

    for (let cname of cacheNames) {
      if (cname.includes(cacheName)) {
        await caches.delete(cname);
      }
    }
  }
  
  function Update() {
    
    fetch(manifestCachePath)
    .then(res => res.json())
    .then(async json => {
      
      let cacheURLs = extractUrlsFromJson(json);
      let version = json.version;
      let newCacheVersionKey = `${cacheName}-v${version}`;
      let cacheNames = await caches.keys();
      let hasLatestCache = cacheNames.find(cname => cname == newCacheVersionKey);
        
      for (let cname of cacheNames) {
        if (cname == newCacheVersionKey) continue;
        if (cname.includes(cacheName)) {
          await caches.delete(cname);
        }
      }
      
      if (hasLatestCache) return;
  
      caches.open(newCacheVersionKey)
      .then(function(cache) {
        return Promise.all(
          cacheURLs.map(function(url) {
            return cache.add(url).catch(function(error) {
              console.error('Failed to cache URL:', url, error);
            });
          })
        );
      })
      .then(function() {
        alert('Done! Reload to take effect.');
      })
      .catch(function(error) {
        alert('Failed. Check console.');
      });
    
    });
    
  };
  
  function loadData() {
    data = JSON.parse(localStorage.getItem(local.componentStorageKey) || local.defaultDataJSON);
  }
  
  function Init() {
    loadData();
    refreshSettingsState();
    
    if (!data.isDevMode && data.isAutoCache) {
      Update();
    }
  }
  
  function refreshSettingsState() {
    let updateBtn = $('[data-action="pwaCacher.update"]');
    let cacheOpt = $('[data-action="pwaCacher.autocache"]');
    let devModeOpt = $('[data-action="pwaCacher.devmode"]');
    
    devModeOpt.checked = data.isDevMode;
    cacheOpt.checked = data.isAutoCache;
    
    updateBtn.disabled = data.isDevMode;
    cacheOpt.disabled = data.isDevMode;
  }
  
  return SELF; 
  
})();
