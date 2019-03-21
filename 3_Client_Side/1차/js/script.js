const Layout = class {
	constructor (model) {
		this.model = model;
		this.listText = `
	      <li>
            <div class="img-wrap"><img src="./img/{{image}}" alt="img{{idx}}"></div>
            <dl>
              <dt>{{artist}} - {{title}}</dt>
              <dd>
                <p class="date">{{date}}</p>
                <p class="price">\\ {{price}}</p>
                <p class="btm"><a href="#" class="btn {{class}}" data-idx={{idx}}>{{cartInfo}}</a></p>
              </dd>
            </dl>
          </li>
		`
	}

	setSideMenu () {
		const target = $(".site-menu");
		$("li:first-child a", target).data('category', 'all');
		$("li:not(:first-child)", target).remove();
		const liText = `<li><a href="#" data-category="{{category}}">{{category}}</a></li>`;
		for (const data of this.model.musicList) {
			const category = data.category;
			if ($(target).find(`a[data-category="${category}"]`).length !== 0) continue;
			$("ul", target).append(liText.replace(/{{category}}/gi, category));
		}
	}

	appendList (condition = `return true`, callback = false) {
		const target = $(".album ul");
		$(".album h2").remove();
		target.empty();
		for (const data of this.model.musicList) {
			const cartInfo = this.model.cart[data.idx];
			const condFunc = new Function('data', condition);
			if (condFunc(data)) {
				const text = this.listText
								.replace(/{{image}}/gi, data.image)
								.replace(/{{idx}}/gi, data.idx)
								.replace(/{{artist}}/gi, data.artist)
								.replace(/{{title}}/gi, data.title)
								.replace(/{{date}}/gi, data.date)
								.replace(/{{price}}/gi, numberFormat(data.price))
								.replace(/{{class}}/gi, cartInfo ? `point` : 'main')
								.replace(/{{cartInfo}}/gi, cartInfo ? `추가하기 (${cartInfo.quantity})` : '쇼핑카트담기')
				target.append(text);
			}
		}
		if (callback !== false) callback();
	}

	setList () {
		if ($(".site-menu").find('li a.active').length == 0) $(".site-menu li:first-child a").addClass('active');
		const category = $(".site-menu li a.active").data('category');
		$('.album h3').text(category);
		layout.appendList(`return '${category}' == 'all' || '${category}' == data.category`);
	}

	loadList () {
		$('.site-menu li a').removeClass('active');
		$(this).addClass('active');
		layout.setList();
	}

	search (e) {
		e.preventDefault();
		const key = $('.input').val();
		const callback = _ => {
			if ($('.album').find('li').length == 0) {
				$('.album').append('<h2 style="text-align:center;">검색된 앨범이 없습니다.</h2>')
			} else {
				$('.album li').each(function (idx, ele) {
					const target = $(this).find('dt');
					const text = target.text();
					const regexp = new RegExp(key, 'gi')
					target.html(text.replace(regexp, `<span class="highlight">${key}</span>`));
				});
			}
		}
		layout.appendList(`return data.title.indexOf('${key}') !== -1 || data.artist.indexOf('${key}') !== -1`, callback);
	}
}

const Cart = class {
	constructor (model, layout) {
		this.model = model;
		this.layout = layout;
		this.cartData = model.cart;
	}

	setCartInfo () {
		const $cartData = this.cartData;
		let sum = 0;
		let len = 0;
		for (const key in $cartData) {
			const quantity = $cartData[key].quantity;
			len += quantity;
			sum += $cartData[key].info.price*quantity;
		}
		sum = numberFormat(sum)
		$(".cart-info p:nth-child(2)").text(`수량 : ${len}`);
		$(".cart-info p:nth-child(3)").text(`가격 : ${sum}`);
		$(".layer .totalPrice").text(sum);
	}

	inCart () {
		const $cartData = cart.cartData;
		const model = cart.model;
		let quantity = 1;
		const idx = $(this).data('idx');
		if ($cartData[idx]) quantity += $cartData[idx].quantity;
		if ($(this).hasClass('main')) $(this).removeClass('main').addClass('point')
		$(this).text(`추가하기 (${quantity})`);
		const musicInfo = model.searchData(idx);
		const totalPrice = quantity*musicInfo.price;
		const data = {
			'info': musicInfo,
			'quantity': quantity,
			'totalPrice': totalPrice
		}
		$cartData[idx] = data;
		localStorage.setItem('cart', JSON.stringify($cartData));
		cart.setCartInfo();
	}

	cartOpen () {
		cart.setCart();
		$('.layer').css({"display":"flex"});
	}

	setCart () {
		$('.layer .cart-list ul').empty();
		const $cartData = cart.cartData;
		const cartLayer = `
			<li>
				<div class="img-wrap"><img src="img/{{image}}" alt="img01"></div>
				<dl>
					<dt>{{artist}} - {{title}}</dt>
					<dd>
						<p class="date">{{date}}</p>
						<p class="price">가격 : \\ {{price}}</p>
						<p class="price">수량 : <input type="text" class="quantity" value="{{quantity}}" data-idx="{{idx}}" /></p>
						<p class="price">합계 : \\ {{totalPrice}}</p>
						<p class="btm"><a href="#" class="btn delete" data-idx="{{idx}}">삭제</a></p>
					</dd>
				</dl>
			</li>`;
		for (const key in $cartData) {
			const data = $cartData[key];
			const info = data.info;
			const text = cartLayer
							.replace(/{{image}}/gi, info.image)
							.replace(/{{idx}}/gi, info.idx)
							.replace(/{{artist}}/gi, info.artist)
							.replace(/{{title}}/gi, info.title)
							.replace(/{{date}}/gi, info.date)
							.replace(/{{price}}/gi, numberFormat(info.price))
							.replace(/{{quantity}}/gi, numberFormat(data.quantity))
							.replace(/{{totalPrice}}/gi, numberFormat(data.totalPrice))
			$('.layer .cart-list ul').append(text);
		}
	}

	cartUpdate () {
		const idx = $(this).data('idx');
		let quantity = $(this).val()*1;
		if (quantity < 1) {
			quantity = 1;
			$(this).val(quantity);
			return false;
		}
		let $cartData = cart.cartData;
		$cartData[idx].quantity = quantity;
		$cartData[idx].totalPrice = quantity*$cartData[idx].info.price;
		localStorage.setItem('cart', JSON.stringify($cartData));
		cart.setCartInfo();
		cart.setCart();
		cart.layout.setList();
	}

	cartDelete () {
		if (!confirm('정말 삭제 하시겠습니까?')) return false;
		const idx = $(this).data('idx');
		let $cartData = cart.cartData;
		delete $cartData[idx];
		localStorage.setItem('cart', JSON.stringify($cartData));
		cart.setCartInfo();
		cart.layout.setList();
		cart.setCart();
	}

	cartPay () {
		localStorage.clear();
		alert("결제가 완료되었습니다.");
		location.reload();
	}
}

const Model = class {
	constructor () {
		this.initMusicList();
		this.initCart();
	}

	initMusicList () {
		this.musicList = [
			{"idx" : 1, "image" : "img01.jpg", "title" : "Hello", "artist" : "허각", "date" : "2011-09-16", "category" : "발라드", "price" : 11000},
			{"idx" : 2, "image" : "img02.jpg", "title" : "야생화", "artist" : "박효신", "date" : "2014-03-28", "category" : "발라드", "price" : 12000},
			{"idx" : 3, "image" : "img03.jpg", "title" : "너의 모든 순간", "artist" : "성시경", "date" : "2014-02-12", "category" : "발라드", "price" : 13000},
			{"idx" : 4, "image" : "img04.jpg", "title" : "Bye bye my blue", "artist" : "백예린", "date" : "2016-06-20", "category" : "R&B/Soul", "price" : 14000},
			{"idx" : 5, "image" : "img05.jpg", "title" : "You Are My Everything", "artist" : "거미", "date" : "2016-03-10", "category" : "발라드", "price" : 15000},
			{"idx" : 6, "image" : "img06.jpg", "title" : "비도 오고 그래서 (Feat. 신용재)", "artist" : "헤이즈(Heize)", "date" : "2017-06-26", "category" : "R&B/Soul", "price" : 16000},
			{"idx" : 7, "image" : "img07.jpg", "title" : "WHY DO FUCKBOIS HANG OUT ON THE NET", "artist" : "Kid Milli", "date" : "2018-03-10", "category" : "랩/힙합", "price" : 17000},
			{"idx" : 8, "image" : "img08.jpg", "title" : "What Lovers Do (Feat. SZA)", "artist" : "Maroon 5", "date" : "2017-11-03", "category" : "Pop", "price" : 18000},
			{"idx" : 9, "image" : "img09.jpg", "title" : "산다는 건 (Cheer Up)", "artist" : "홍진영", "date" : "2014-11-06", "category" : "트로트", "price" : 19000},
			{"idx" : 10, "image" : "img10.jpg", "title" : "Havana (Feat. Young Thug)", "artist" : "Camila Cabello", "date" : "2018-01-12", "category" : "Pop", "price" : 20000},
			{"idx" : 11, "image" : "img11.jpg", "title" : "Jasmine", "artist" : "DPR LIVE", "date" : "2017-12-07", "category" : "랩/힙합", "price" : 21000},
			{"idx" : 12, "image" : "img12.jpg", "title" : "밤편지", "artist" : "아이유", "date" : "2017-03-24", "category" : "발라드", "price" : 22000},
			{"idx" : 13, "image" : "img13.jpg", "title" : "초혼", "artist" : "장윤정", "date" : "2010-06-08", "category" : "트로트", "price" : 23000},
			{"idx" : 14, "image" : "img14.jpg", "title" : "나비잠 (Sweet Dream)", "artist" : "희철 (HEECHUL), 민경훈", "date" : "2016-11-20", "category" : "록/메탈", "price" : 24000},
			{"idx" : 15, "image" : "img15.jpg", "title" : "파란 봄", "artist" : "에일리", "date" : "2018-06-24", "category" : "발라드", "price" : 25000},
			{"idx" : 16, "image" : "img16.jpg", "title" : "Closer (Feat. Halsey)", "artist" : "The Chainsmokers", "date" : "2016-11-05", "category" : "Pop", "price" : 26000},
			{"idx" : 17, "image" : "img17.jpg", "title" : "High Hopes", "artist" : "Panic! At The Disco", "date" : "2018-06-22", "category" : "Pop", "price" : 27000},
			{"idx" : 18, "image" : "img18.jpg", "title" : "비정(非情)", "artist" : "김경호", "date" : "2018-06-22", "category" : "록/메탈", "price" : 28000}
		];
	}

	initCart () {
		this.cartStorage = localStorage.getItem('cart');
		this.cart = this.cartStorage ? JSON.parse(this.cartStorage) : {};
	}

	searchData (idx) {
		for (const data of this.musicList) {
			if (data.idx == idx) return data;
		}
	}
}

const model = new Model();
const layout = new Layout(model);
const cart = new Cart(model, layout);
const siteLoader = _ => {

	const style = `
		<style>
			.highlight {background: #09f; color: #fff}
			.layer {position:fixed;top:0;bottom:0;right:0;left:0;background:rgba(0,0,0,.5);display:none;justify-content:center;align-items:center;}
			.layer > .wrap {width:70vw;height:80vh;padding:10px;background:#fff;border-radius:10px;position:relative;overflow:hidden;}
			.layer-close {position:absolute;top:0;right:10px;font-size:20px;color:#aaa;}
			.layer h2 {margin-top:10px;font-size:20px;text-align:center;}
			.layer .cart-list {width:90%;height:70%;margin:40px auto 0 auto;border:1px solid #000;}
			.layer .cart-list > ul {width:100%;height:100%;display:flex;overflow:auto;justify-content:flex-start;flex-wrap:wrap;}
			.layer .cart-list li {width:30%;height:50%;display:flex;align-items:center;justify-content:space-between;}
			.layer .cart-list .img-wrap {width:45%;height:100%;display:flex;align-items:center;}
			.layer .cart-list img {max-width:100%;max-height:100%;}
			.layer .cart-list d1 {display:flex;align-items:center;width:45%;}
			.layer .cart-list dt {font-size:14px;}
			.layer .cart-list .date {font-size:12px;}
			.layer .cart-list p {font-size:12px;}
			.layer .pay-btn {width:100px;height:40px;background:#09f;color:#fff;border:none;display:block;margin:30px auto;}
			.layer p {margin-top:10px;text-align:center;font-size:20px;}
		</style>
	`;

	const layer = `
		<div class="layer">
			<div class="wrap">
				<a href="#" class="layer-close">x</a>
				<h2>카트 정보</h2>
				<div class="cart-list">
					<ul></ul>
				</div>
				<p>총 결제 금액 : \\ <span class="totalPrice"></span></p>
				<button class="pay-btn">결제</button>
			</div>
		</div>
	`;

	$('head').append(style);
	$('body').append(layer);

	layout.setSideMenu();
	layout.setList();
	cart.setCartInfo();
}
const numberFormat = number => {
	return new Intl.NumberFormat().format(number);
}

$(siteLoader)
.on("click", "a[href='#']", e => e.preventDefault() )
.on("click", ".site-menu li > a", layout.loadList)
.on("submit", ".search form", layout.search)
.on("click", ".album li .btn", cart.inCart)
.on("click", ".cart-info .btn", cart.cartOpen)
.on("click", ".layer-close", _ => $('.layer').hide())
.on("change", ".layer .quantity", cart.cartUpdate)
.on("click", ".layer .delete", cart.cartDelete)
.on("click", ".layer .pay-btn", cart.cartPay)