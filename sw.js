
/**
 * ServiceWorkerの処理
 * -----------------------------------------------------------------------------
 * 以下参考にしてキャッシュとかのインストール処理を書くといいです。
 * https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja
 * 以下コードはほぼコピーです。
 */

 // キャッシュ名とキャッシュファイルの指定
let CACHE_NAME = 'pwa-sample-caches';
let urlsToCache = [
	// '/',
	// '/css/style.css',
	// '/main.js'
];

// インストール処理
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(urlsToCache);
			})
	);
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches
			.match(event.request)
			.then(function(response) {
				if (response) return response;
				var fetchRequest = event.request.clone();
				return fetch(fetchRequest).then(
					function(response) {
						if(!response || response.status !== 200 || response.type !== 'basic') return response;
						var responseToCache = response.clone();
						caches.open(CACHE_NAME)
							.then(function(cache) {
								cache.put(event.request, responseToCache);
							}
						);
						return response;
					}
				);
			}
		)
	);
});
