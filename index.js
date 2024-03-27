
$(document).ready(()=>{
    getCoinData();
});
let liveReports = [];
async function getCoinData(){
    try{
        await retrieveCoinData();
    }catch(error){
    }
}
function retrieveCoinData(){
    let coin_array = JSON.parse(localStorage.getItem('coin_array'));
    return new Promise((resolve,reject)=>{
    
        if(coin_array){
             resolve(
                createCoins(coin_array)
            )
        }else{
            reject(
                coinGeckoApiCaller()
            )
        }
    })

    
}
function createCoins(coin_array){
    updateStorage(coin_array);
    renderCoinsToCard(coin_array);
};
function renderCoinsToCard(coin_array){
    for(coin of coin_array){
        $('#rootContainer').append(`
    <div id="${coin.id}"class="card col-4" style="width: 13rem">
        <div class="form-check form-switch form-check-reverse">
            <input
              class="form-check-input"
              type="checkbox"
              id="switchButton"
              onclick=handleCoinToggle(this)
            />
          </div>
        <img src="${coin.image.small}" class="card-img-top w-25" alt="image" />
        <div class="card-body">
          <h5 class="card-title">${coin.name}</h5>
        </div>
        <a href="#" class="btn btn-outline-primary" onclick=coinInfoBtn(this)>More Info</a>
        <div id="coinInfo">
            <p>${coin.market_data.current_price.usd}&#36;</p>
            <p>${coin.market_data.current_price.eur}&#x20AC;</p>
            <p>${coin.market_data.current_price.ils}&#x20aa;</p>
        </div>
    </div>`)
    }
};
function coinInfoBtn(thisCoin){
    $(thisCoin).next('#coinInfo').toggle();
    
}
function updateStorage(coin_array){
    localStorage.setItem('coin_array', JSON.stringify(coin_array));
};
function coinGeckoApiCaller(){
    console.log('API is activated');
    $.ajax({
    url: 'https://api.coingecko.com/api/v3/coins?order=market_cap_desc&per_page=100&page=1',
    success: coin_array => createCoins(coin_array)
   
})};
function refreshData(){
    let refreshRate = 10000
    setInterval(()=>{
        coinGeckoApiCaller();
    },refreshRate);
}
function handleCoinToggle(value){
    console.log('Toggle button clicked')
    let selectedCoin = value.parentElement.parentElement
    if(!selectedCoin.clicked || selectedCoin.clicked == false){
        selectedCoin.clicked = true
        console.log('Coin is added to array')
        addToLiveReports(selectedCoin)
    }else if(selectedCoin.clicked == true){
        selectedCoin.clicked = false
        removeFromLiveReports(selectedCoin)
        if(liveReports.length >= 4){
            closeOptionsWindow();
        }
        
        console.log('Coin is removed from array')
    }
}

function removeFromLiveReports(selectedCoin){
    console.log('removing Coin now')
    liveReports = liveReports.filter(coin => coin.id != selectedCoin.id)
    return liveReports
}


function addToLiveReports(selectedCoin){ 
    console.log('checking array length')
    if(liveReports.length == 5){
        console.log('Array is over capped')
        openOptionsWindow();
    }else{
        console.log('Array is not capped')
        addCoinToArray(selectedCoin);
        }
}
function addCoinToArray(selectedCoin){
    liveReports.push(selectedCoin);
    return liveReports
}

function InjectCurrentArray(liveReports){
    console.log('injecting array contents into modal')
    let copiedliveReports = $(liveReports).clone();
    for(coin of copiedliveReports){
        coin.clicked = true
    }
    $('#modalContent').append(copiedliveReports);
    

}

function closeOptionsWindow(){
    console.log('closing warning window')
    $('#modalContent').empty();
    $('#warningModal').modal('hide');
}
function openOptionsWindow(){
    console.log('Opening warning window')
    $('#warningModal').modal('show');
    InjectCurrentArray(liveReports);
}

function searchBarExecute(){
    $('#navbar').text(function(){
    let searchedLetters = $(this).val().toLowerCase();
    $('#rootContainer div').each(function(){
        let search = $(this).text().toLowerCase();
        if(search.indexOf(searchedLetters)>-1){
            $(this).not('#coinInfo').show();
        }else{
            $(this).hide();
        }
    })
})
}
$(document).on({
    ajaxStart: function(){
        $("body").addClass("loading"); 
    },
    ajaxStop: function(){ 
        $("body").removeClass("loading"); 
    }    
});


