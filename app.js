
const apiKey = '56c2d8286d951ef493ce38b9c5d93362';
const loadingText = 'Loading...';

const button = document.getElementById('search-btn');
const input = document.getElementById('search-input');
const resultList = document.getElementById('result-list');
const container = document.getElementById('movie-container');

function xhrRequest(url) {
    const xhr = new XMLHttpRequest();
    let requestResultObj = {};
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status != 200) {
        console.log( xhr.status + ': ' + xhr.statusText );
    } else {
        try {
            requestResultObj = JSON.parse(xhr.responseText);
        } catch (error) {
            console.log(error);
        }
    }
    return requestResultObj;
}

function generateList(obj, container, linkPrefix, clickHandler) {
    container.innerText = '';
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            let li = document.createElement("li");
            let link = document.createElement("a");
            const title = item.name || item.title;
            link.href = '#'+linkPrefix+'/'+ item.id;
            link.textContent = title;
            li.appendChild(link);
            if (typeof clickHandler == 'function') {
                link.addEventListener('click', (e) => {
                    clickHandler(item);
                }); 
            }
            container.appendChild(li);
        });
    }
}

function searchFilms(url) {
    if (!url) {
        url = 'https://api.themoviedb.org/3/trending/all/day?api_key=' + apiKey;
    }
    resultList.innerHTML = loadingText;
    let requestResultObj = xhrRequest(url);

    console.log(requestResultObj);

    if (Array.isArray(requestResultObj.results)) {
        resultList.innerHTML = '';
        container.innerHTML = '';
        requestResultObj.results.forEach(item => {
            generateList(requestResultObj.results, resultList, 'movie', (item) => {
                resultList.innerHTML = '';
                
                let img = document.createElement("img");
                let headerTitle = document.createElement("h1");
                let description = document.createElement("p");
                let recomendationTitle = document.createElement("h3");
                let recomendationContainer = document.createElement("div");
                img.src = 'https://image.tmdb.org/t/p/w500/'+ item.poster_path;
                const title = item.name || item.title;
                img.title = title;
                headerTitle.innerText = title;
                recomendationTitle.innerText = 'Recomendations';
                recomendationContainer.innerText = loadingText;
                description.innerText = item.overview;
                
                container.appendChild(img);
                container.appendChild(headerTitle);
                container.appendChild(description);
                container.appendChild(recomendationTitle);
                container.appendChild(recomendationContainer);
                
                const url = 'https://api.themoviedb.org/3/movie/' + item.id + '/recommendations?language=en-US&page=1&api_key=' + apiKey;
                const response = xhrRequest(url);
                recomendationContainer.innerText = '';
                generateList(response.results, recomendationContainer, 'recommendation');
            });
        });
    }
}

button.addEventListener('click', () => {
    const searchQuery = input.value;
    let searchRequestURL;
    if (searchQuery.length > 0) {
        searchRequestURL = 'https://api.themoviedb.org/3/search/movie?query=' + searchQuery + '&language=en-US&page=1&include_adult=false&api_key=' + apiKey;
    }
    searchFilms(searchRequestURL);    
});

searchFilms();