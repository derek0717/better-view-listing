chrome.runtime.onInstalled.addListener(async() => {
    const currentItems = await chrome.storage.local.get(['mercari_view', 'mercari_refresh', 'fromjapan_view', 'fromjapan_refresh']);
    const mercari_view = currentItems['mercari_view'] || false,
        mercari_refresh = currentItems['mercari_refresh'] || false,
        fromjapan_view = currentItems['fromjapan_view'] || false,
        fromjapan_refresh = currentItems['fromjapan_refresh'] || false;
    await chrome.storage.local.set({ mercari_view, mercari_refresh, fromjapan_view, fromjapan_refresh });
    chrome.storage.local.get(['mercari_view', 'mercari_refresh', 'fromjapan_view', 'fromjapan_refresh'],function(items){
        console.log('Finish init app', items['mercari_view'], items['mercari_refresh'], items['fromjapan_view'], items['fromjapan_refresh']);
    });
});