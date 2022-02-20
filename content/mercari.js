async function mercari(){
    console.log('┣ Start script');

    let items = await chrome.storage.local.get(['mercari_view', 'mercari_refresh']);
    let isView = items['mercari_view'] || false;
    let isRefresh = items['mercari_refresh'] || false;

    /****************/
    /* style toggle */
    var timer;
    var timer2;
    const initialTimeout = (24999+parseInt(Math.random()*1000-500));
    const cycleTimeout = 13999;
    const div = document.createElement('div');

    var label = document.createElement("label");
    label.classList.add("dToggle");
    label.classList.add("dYellow");
    var checkbox = document.createElement("input");
    checkbox.type='checkbox';
    checkbox.style.display='none';

    if(isView) {
        checkbox.checked = 'checked';
        document.querySelector('body').classList.add("d");
    }

    let controller;
    checkbox.addEventListener('change', async(event) => {
        if (event.currentTarget.checked) {
            document.querySelector('body').classList.add("d");
            let mercari_view = true;
            window.dispatchEvent(new Event('resize'));
            overrideItemClick();
            await chrome.storage.local.set({mercari_view});
        } else {
            document.querySelector('body').classList.remove("d");
            let mercari_view = false;
            window.dispatchEvent(new Event('resize'));
            if(controller)controller.abort();
            await chrome.storage.local.set({mercari_view},function(){});
        }
    });
    label.appendChild(checkbox);
    var span = document.createElement("span");
    span.appendChild(document.createTextNode("★"));
    label.appendChild(span);
    div.appendChild(label);
    var label2 = document.createElement("label");
    label2.classList.add("dToggle");
    label2.classList.add("dRed");
    var checkbox2 = document.createElement("input");
    checkbox2.type='checkbox';
    checkbox2.style.display='none';

    if(isRefresh){
        checkbox2.checked='checked';
    }

    var line = document.createElement('div');
    checkbox2.addEventListener('change', async(event) => {
        if (event.currentTarget.checked) {
            let mercari_refresh = true;
            await chrome.storage.local.set({mercari_refresh});
            refreshItem();
        } else {
            let mercari_refresh = false;
            line.style.animation = 'none';
            line.offsetHeight;
            await chrome.storage.local.set({mercari_refresh});
        }
    })
    label2.appendChild(checkbox2);
    var span2 = document.createElement("span");
    span2.appendChild(document.createTextNode("↻"));
    label2.appendChild(span2);
    div.appendChild(label2);
    div.classList.add('dControl');
    document.getElementsByTagName('body')[0].appendChild(div);

    /****************/
    /* auto refresh */
    line.classList.add('dLine');

    if(isRefresh) {
        line.style.animation='dCountDown '+initialTimeout+'ms linear';
    }
    document.getElementsByTagName('body')[0].appendChild(line);

    function reflowLine(ms){
        line.style.animation = 'none';
        line.offsetHeight;
        line.style.animation = 'dCountDown '+(ms)+'ms linear';
    }
    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    function refreshItem(){
        if(!location.href.match(/https\:\/\/jp\.mercari\.com\/search\?[a-z\&]{1,}\=(?:.){1,}/)){
            checkbox2.checked=false;
            console.log('Auto refresh stopped');
        }else if(checkbox2.checked){
            if(timer)clearTimeout(timer);
            const memNow = window.performance.memory.usedJSHeapSize;
            if(memNow>200000000){
                console.log('Memory:',bytesToSize(memNow),'; Reloading page..');
                location.reload();
            } else {
                const next = (cycleTimeout+parseInt(Math.random()*1000-500));
                if(!document.hidden){
                    document.querySelector("mer-search-input").shadowRoot.querySelector(".for-search mer-icon-button").click();
                }
                reflowLine(next);
                console.log(document.hidden?'Hidden;':'','Memory:'+bytesToSize(memNow)+';','Next refresh', next+'ms');
                timer=setTimeout(refreshItem, next);
            }
        }else{
            console.log('Auto refresh stopped');
        }
    }

    if(isRefresh) {
        timer = setTimeout(refreshItem, initialTimeout);
    }

    function overrideItemClick(){
        controller = new AbortController();
        var grid = document.getElementById('item-grid');
        // var grid = document.getElementsByTagName('body')[0];
        if(grid){
            grid.addEventListener('click', (event) => {
                if(event.target.getAttribute("data-testid")=='item-cell'){
                    if(event.target.querySelector('a').getAttribute('href')){
                        window.open(event.target.querySelector('a').getAttribute('href'), '_blank');
                    }
                }
            }, {signal: controller.signal});
        }else{
            if(timer2)clearTimeout(timer2);
            timer2=setTimeout(overrideItemClick, 1000);
        }
    }
    if(isView){
        overrideItemClick();
    }

    /* memory stat */
    /* https://stackoverflow.com/a/31172693 */
    // var script=document.createElement('script');
    // script.src='https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';
    // document.head.appendChild(script);

    console.log('┗ End script');
}
mercari();