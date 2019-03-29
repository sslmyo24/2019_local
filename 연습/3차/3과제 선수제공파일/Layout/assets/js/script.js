const Render = class {
	constructor (model) {
		this.model = model;
		this.setCategory();
		this.setCartInfo();
		this.appendList();
	}

	setCategory () {
		const target = $("#main-menu");
		$("li:not(:first-child):not(:nth-child(2))", target).remove();
		$("li:nth-child(2) > a", target).data('category', 'ALL');
		let category = [];
		for (const data of this.model.musicList) {
			if (category.includes(data.category)) continue;
			category.push(data.category);
			const text = `
				<li>
                    <a href="#" data-category="${data.category}"><i class="fa fa-youtube-play fa-2x"></i> <span>${data.category}</span></a>
                </li>
			`;
			target.append(text);
		}
	}

	setCartInfo () {
		const cart = this.model.cart;
		const albumList = this.model.musicList;
		const target = $(".model-body");
		$('table',target).empty();
		let quantity = 0;
		let totalPrice = 0;
		for (const key in cart) {
			const cartData = cart[key];
			const albumData = albumList[key];
			quantity += cart.quantity;
			totalPrice += cart.totalPrice;
			const text = `
				<tr>
                    <td class="albuminfo">
                        <img src="/images/${albumData.albumJaketImage}">
                        <div class="info">
                            <h4>${albumData.albumName}</h4>
                            <span>
                                <i class="fa fa-microphone"> 아티스트</i> 
                                <p>${albumData.artist}</p>
                            </span>
                            <span>
                                <i class="fa  fa-calendar"> 발매일</i> 
                                <p>${albumData.release}</p>
                            </span>
                        </div>
                    </td>
                    <td class="albumprice">
                        ￦ ${numberFormat(albumData.price)}
                    </td>
                    <td class="albumqty">
                        <input type="number" class="form-control" value="${cart.quantity}">
                    </td>
                    <td class="pricesum">
                        ￦ ${numberFormat(cart.totalPrice)}
                    </td>
                    <td>
                        <button class="btn btn-default" data-idx="${albumData.idx}">
                            <i class="fa fa-trash-o"></i> 삭제
                        </button>
                    </td>
                </tr>
			`;
			$('table',target).append(text);
		}
		$('.totalprice > span', target).text(`￦${numberFormat(totalPrice)}`);
		$('.panel-body > button').html(`<i class="fa fa-shopping-cart"></i> 쇼핑카트 <strong>${numberFormat(quantity)}</strong> 개 금액 ￦ ${numberFormat(totalPrice)}원</a>`);
	}

	appendList (key = null) {
		const target = $('.contents');
		target.empty();
		const albumList = this.model.musicList.slice();
		const sortList = albumList.sort(function (a, b) {
			const aDate = a.release.replace('.','');
			const bDate = b.release.replace('.','');
			return bDate - aDate;
		});
		const category = $('#main-menu .active-menu').data('category');
		$("h2").text(category);
		for (const data of sortList) {
			if (category !== 'ALL' && category !== data.category) continue;
			let albumName = data.albumName;
			let artist = data.artist;
			if (key !== null && albumName.indexOf(key) === -1 && artist.indexOf(key) === -1) continue;
			if (key !== null) {
				const reg = new RegExp(key, 'gi');
				albumName = albumName.replace(key, `<strong style="background:#09f;color:#fff;">${key}</strong>`);
				artist = artist.replace(key, `<strong style="background:#09f;color:#fff;">${key}</strong>`);
			}
			const cartState = this.model.cart[data.idx] !== undefined ? `추가하기 (${this.model.cart[data.idx]}개)` : '쇼핑카트담기';
			const text = `
				<div class="col-md-2 col-sm-2 col-xs-2 product-grid">
                    <div class="product-items">
                            <div class="project-eff">
                                <img class="img-responsive" src="images/${data.albumJaketImage}" alt="Time for the moon night">
                            </div>
                        <div class="produ-cost">
                            <h5>${albumName}</h5>
                            <span>
                                <i class="fa fa-microphone"> 아티스트</i> 
                                <p>${artist}</p>
                            </span>
                            <span>
                                <i class="fa  fa-calendar"> 발매일</i> 
                                 
                                <p>${data.release}</p>
                            </span>
                            <span>
                                <i class="fa fa-money"> 가격</i>
                                <p>￦${numberFormat(data.price)}</p>
                            </span>
                            <span class="shopbtn">
                                <button class="btn btn-default btn-xs" data-idx="${data.idx}">
                                    <i class="fa fa-shopping-cart"></i> ${cartState}
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
			`;
			target.append(text);
		}
	}

	categorySelect () {
		const $render = this
		return function () {
			$("#main-menu .active-menu").removeClass('active-menu');
			$(this).find('a').addClass('active-menu');
			$render.appendList();
		}
	}

	search () {
		const $render = this
		return function () {
			const key = $(this).parents('.search').find('input').val();
			$render.appendList(key);
		}
	}
}

const Model = class {
	constructor () {
		this.initMusicList();
		this.initCart();
	}

	initMusicList () {
		const musicList = {
    "data" : [
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166224.jpg",
                "albumName"         : "너를 그리다 Part.2",
                "artist"            : "김재희",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166274.jpg",
                "albumName"         : "Hocus Pocus",
                "artist"            : "PLT",
                "release"           : "2018.05.12",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165912.jpg",
                "albumName"         : "도도한 여자",
                "artist"            : "엘아이",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165746.jpg",
                "albumName"         : "밀푀유나베",
                "artist"            : "모던다락방(Modern Darakbang)",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166491.jpg",
                "albumName"         : "오감만족 / 나를 철들게한 사랑",
                "artist"            : "정주",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164944.jpg",
                "albumName"         : "어느 오후 4시",
                "artist"            : "김민수",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165186.jpg",
                "albumName"         : "Yo Yo",
                "artist"            : "이철휘 & 스페이스502",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167196.jpg",
                "albumName"         : "눈뜨고 눈 감을 때까지",
                "artist"            : "민낯",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20164821.jpg",
                "albumName"         : "기억, 기록",
                "artist"            : "Zmay",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166677.jpg",
                "albumName"         : "Replay",
                "artist"            : "미스틱하트",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165354.jpg",
                "albumName"         : "The Light",
                "artist"            : "이태희",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165649.jpg",
                "albumName"         : "1ST ALBUM 'GOODBYE 20's'",
                "artist"            : "용준형",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165657.jpg",
                "albumName"         : "하고 싶은 말 (What I Want To Say)",
                "artist"            : "마리 X 선정 (MARY X SUN)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166327.jpg",
                "albumName"         : "Sunset",
                "artist"            : "프리지아",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164947.jpg",
                "albumName"         : "Kim's Trio",
                "artist"            : "Kim's Trio",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160553.jpg",
                "albumName"         : "Village de Lumiere",
                "artist"            : "비쥬얼 보이스(Visual Voice)",
                "release"           : "2018.04.19",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166877.jpg",
                "albumName"         : "Additional",
                "artist"            : "폴킴(Paul Kim)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166541.jpg",
                "albumName"         : "불상사",
                "artist"            : "홀리몰리(HolyMoly)",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167360.jpg",
                "albumName"         : "Come with me",
                "artist"            : "Hyuk",
                "release"           : "2018.05.18",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161517.jpg",
                "albumName"         : "SnapShot",
                "artist"            : "IN2IT (인투잇)",
                "release"           : "2018.04.19",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20167266.jpg",
                "albumName"         : "첫 번째 계절",
                "artist"            : "등가쿤",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166620.jpg",
                "albumName"         : "Ginger Is Here",
                "artist"            : "Ginger",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "740232.jpg",
                "albumName"         : "사랑하지 않을 거라면",
                "artist"            : "동급생",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167531.jpg",
                "albumName"         : "2bed",
                "artist"            : "프롬올투휴먼(from all to human)",
                "release"           : "2018.05.18",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166238.jpg",
                "albumName"         : "D. Pepper",
                "artist"            : "bruz.",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166305.jpg",
                "albumName"         : "Unhairable",
                "artist"            : "리트머스(Litmus)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166237.jpg",
                "albumName"         : "Somethin'",
                "artist"            : "영(Young)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165655.jpg",
                "albumName"         : "Pillow Fight",
                "artist"            : "비비드피넛",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "732151.jpg",
                "albumName"         : "오늘이 세상 마지막 날이라 해도",
                "artist"            : "버스터즈(BURSTERS)",
                "release"           : "2018.04.13",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163616.jpg",
                "albumName"         : "Providence",
                "artist"            : "스노우문(Snow Moon)",
                "release"           : "2018.05.01",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165606.jpg",
                "albumName"         : "그대 / 미운정 고운정 / 당신 내사랑",
                "artist"            : "유달",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162089.jpg",
                "albumName"         : "비가 오네요",
                "artist"            : "Kenji & ANi-",
                "release"           : "2018.04.30",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161215.jpg",
                "albumName"         : "그대일까 그때일까",
                "artist"            : "누크(Nuke)",
                "release"           : "2018.04.19",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166997.jpg",
                "albumName"         : "Fresh Start",
                "artist"            : "진성",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166268.jpg",
                "albumName"         : "복면가왕 153회",
                "artist"            : "MBC",
                "release"           : "2018.05.13",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162087.jpg",
                "albumName"         : "노답",
                "artist"            : "Maradise",
                "release"           : "2018.04.30",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164818.jpg",
                "albumName"         : "우리 사랑",
                "artist"            : "윤중식",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20163999.jpg",
                "albumName"         : "인생의 동반자 / 천관산",
                "artist"            : "김광율",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165905.jpg",
                "albumName"         : "#1 Will be a start",
                "artist"            : "케이윌",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166018.jpg",
                "albumName"         : "Cheese Cake",
                "artist"            : "미스틱하트",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165163.jpg",
                "albumName"         : "차현 트리오 작품집 하나",
                "artist"            : "차현 트리오",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165509.jpg",
                "albumName"         : "A Lifetime",
                "artist"            : "LVGOON",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165566.jpg",
                "albumName"         : "손톱달",
                "artist"            : "하경",
                "release"           : "2018.05.13",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165677.jpg",
                "albumName"         : "Love Loves To Love Love",
                "artist"            : "페이버릿(FAVORITE)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163685.jpg",
                "albumName"         : "웬만해선 우리를 막을 수 없다",
                "artist"            : "크라잉넛(Crying Nut)",
                "release"           : "2018.05.02",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160432.jpg",
                "albumName"         : "이제 말해 볼게",
                "artist"            : "지미네이터(Jiminator)",
                "release"           : "2018.04.23",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167300.jpg",
                "albumName"         : "Good Night, You",
                "artist"            : "바른생활",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20159899.jpg",
                "albumName"         : "The 8th Repackage Album",
                "artist"            : "SUPER JUNIOR (슈퍼주니어)",
                "release"           : "2018.04.12",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "734300.jpg",
                "albumName"         : "Blue Dream",
                "artist"            : "The Flavr Blue",
                "release"           : "2018.04.20",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165989.jpg",
                "albumName"         : "As Time Goes By",
                "artist"            : "Little Shin Group",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160977.jpg",
                "albumName"         : "NEW MOON",
                "artist"            : "JBJ",
                "release"           : "2018.04.17",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165577.jpg",
                "albumName"         : "Swear",
                "artist"            : "영 스위시(Young Swish)",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166303.jpg",
                "albumName"         : "Rules When You Love",
                "artist"            : "Ggg",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165885.jpg",
                "albumName"         : "이젠 안녕",
                "artist"            : "IK BROTHERS(아이케이 브라더즈)",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167283.jpg",
                "albumName"         : "걸음",
                "artist"            : "에녹(Enoch)",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160818.jpg",
                "albumName"         : "The Otherside",
                "artist"            : "Dream World Diary(드림 월드 다이어리)",
                "release"           : "2018.04.18",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165584.jpg",
                "albumName"         : "베짱이와 개미",
                "artist"            : "하언",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165730.jpg",
                "albumName"         : "Hope",
                "artist"            : "니오(Neo)",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165156.jpg",
                "albumName"         : "Wanna Go Back",
                "artist"            : "Band GON",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165332.jpg",
                "albumName"         : "스위치-세상을 바꿔라(SBS수목드라마)",
                "artist"            : "차여울",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164520.jpg",
                "albumName"         : "체온 / 혼자두지 않을겁니다",
                "artist"            : "오원도",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166365.jpg",
                "albumName"         : "마지막 노래",
                "artist"            : "필교(Pil Kyo)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167190.jpg",
                "albumName"         : "HIPHOP BAKA",
                "artist"            : "짧은머리",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20157485.jpg",
                "albumName"         : "Hallelujah",
                "artist"            : "몬스터스 다이브(Monsters Dive)",
                "release"           : "2018.04.10",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166361.jpg",
                "albumName"         : "샘스블루스 (Sam's Blues)",
                "artist"            : "샘샘트리오(SamSam Trio)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166269.jpg",
                "albumName"         : "꽃비",
                "artist"            : "선하",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165621.jpg",
                "albumName"         : "Comma Of Maison D",
                "artist"            : "빈티지코드(Vintage Chord)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165924.jpg",
                "albumName"         : "우리의 세월",
                "artist"            : "김광수",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166566.jpg",
                "albumName"         : "김준혁",
                "artist"            : "김준혁(kim Junhyeok)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165960.jpg",
                "albumName"         : "클래프 프로젝트",
                "artist"            : "서은광 [비투비]",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167003.jpg",
                "albumName"         : "나와 같기를",
                "artist"            : "창석",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20166356.jpg",
                "albumName"         : "스무 살",
                "artist"            : "앨리스(Alice)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165615.jpg",
                "albumName"         : "우리걷자",
                "artist"            : "홍휴",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166363.jpg",
                "albumName"         : "버드리가 간다",
                "artist"            : "버드리(Beo Deu Ri)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164817.jpg",
                "albumName"         : "그대와",
                "artist"            : "잔별",
                "release"           : "2018.05.07",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167056.jpg",
                "albumName"         : "눈에 담고 싶은 그림",
                "artist"            : "피노(Pino)",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166205.jpg",
                "albumName"         : "가지마 / 도련님",
                "artist"            : "고하자(Gohaja)",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163448.jpg",
                "albumName"         : "봄노래",
                "artist"            : "가능동밴드",
                "release"           : "2018.04.30",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164976.jpg",
                "albumName"         : "사랑방 / 이화령아가씨",
                "artist"            : "예금주",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166761.jpg",
                "albumName"         : "2018 심신 Shall we dance",
                "artist"            : "심신",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164616.jpg",
                "albumName"         : "결혼하고 싶어",
                "artist"            : "피아니카",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166949.jpg",
                "albumName"         : "알아요",
                "artist"            : "오드(Odd)",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167216.jpg",
                "albumName"         : "우리를 지우면서",
                "artist"            : "야수(YASU)",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167017.jpg",
                "albumName"         : "화해",
                "artist"            : "파스텔라운지",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165693.jpg",
                "albumName"         : "The Last Cold Snap",
                "artist"            : "클라피(Klophe)",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167331.jpg",
                "albumName"         : "늦은 아침에",
                "artist"            : "소소",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "742446.jpg",
                "albumName"         : "Treats on Me",
                "artist"            : "GIWON",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163435.jpg",
                "albumName"         : "부잣집 아들 (MBC 주말드라마)",
                "artist"            : "주원탁(JOO WON TAK)",
                "release"           : "2018.04.29",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164028.jpg",
                "albumName"         : "글리사운드 2nd 프로젝트 FLOW AWAY",
                "artist"            : "루디커밍나우(rudicomingnow)",
                "release"           : "2018.05.07",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163060.jpg",
                "albumName"         : "Shake Heart",
                "artist"            : "최윤",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165162.jpg",
                "albumName"         : "연인 (戀人)",
                "artist"            : "창오",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164802.jpg",
                "albumName"         : "가요 천국 사람들",
                "artist"            : "NA",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166681.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "한살차이",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166916.jpg",
                "albumName"         : "REPETITION",
                "artist"            : "칸토",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167238.jpg",
                "albumName"         : "가요공감 2집",
                "artist"            : "현준",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164521.jpg",
                "albumName"         : "노래로 만든 한국인이 사랑하는 명시 33선",
                "artist"            : "정의송",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165297.jpg",
                "albumName"         : "Your Secret To Flow",
                "artist"            : "멜트인멜트",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165659.jpg",
                "albumName"         : "내가 부르는 노래",
                "artist"            : "비비(BB)",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167014.jpg",
                "albumName"         : "Beat Coin",
                "artist"            : "88Kingz",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161284.jpg",
                "albumName"         : "Romance",
                "artist"            : "Kingdom",
                "release"           : "2018.04.20",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165631.jpg",
                "albumName"         : "친애하는 마누라",
                "artist"            : "윤호",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167327.jpg",
                "albumName"         : "K.R.E.A.M.",
                "artist"            : "와디의 신발장",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166252.jpg",
                "albumName"         : "Black Gradation - Move On",
                "artist"            : "JAY.D.S",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166498.jpg",
                "albumName"         : "취한 밤",
                "artist"            : "메이트 제이 (Mate J)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166738.jpg",
                "albumName"         : "Anymore",
                "artist"            : "주아(JUA)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164904.jpg",
                "albumName"         : "Your Thoughts",
                "artist"            : "리트머스(Litmus)",
                "release"           : "2018.05.08",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165832.jpg",
                "albumName"         : "창문의 다른 세계",
                "artist"            : "원스페이스(1Space)",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164610.jpg",
                "albumName"         : "너만 있다면",
                "artist"            : "소음밴드(蘇音 Band)",
                "release"           : "2018.05.05",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165582.jpg",
                "albumName"         : "나일순없나요",
                "artist"            : "y군",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164446.jpg",
                "albumName"         : "MBC 드라마 데릴남편 오작두 OST",
                "artist"            : "MBC",
                "release"           : "2018.05.05",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20158793.jpg",
                "albumName"         : "Raven",
                "artist"            : "올가닉 시티(Organic City)",
                "release"           : "2018.04.17",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166189.jpg",
                "albumName"         : "빠리가 당신을 부를 때 (De Paris À Séoul)",
                "artist"            : "시나(Sina)",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165896.jpg",
                "albumName"         : "Joker",
                "artist"            : "펑크파인애플(Punk Pineapple)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164922.jpg",
                "albumName"         : "살아볼래요",
                "artist"            : "샘윤(Sam Yoon)",
                "release"           : "2018.05.04",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20161254.jpg",
                "albumName"         : "Live, Fire and Blasphemy",
                "artist"            : "NA",
                "release"           : "2018.04.23",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163321.jpg",
                "albumName"         : "장난이었으면",
                "artist"            : "김현진",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166617.jpg",
                "albumName"         : "Mirage",
                "artist"            : "ANewJean",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167323.jpg",
                "albumName"         : "Stinkily",
                "artist"            : "멜트인멜트",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163864.jpg",
                "albumName"         : "말해봐",
                "artist"            : "레즐리",
                "release"           : "2018.05.01",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160485.jpg",
                "albumName"         : "Void",
                "artist"            : "더 로즈(The Rose)",
                "release"           : "2018.04.16",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166657.jpg",
                "albumName"         : "저녁 아홉시",
                "artist"            : "Groove N Joy(그루브 앤 조이)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165286.jpg",
                "albumName"         : "Leave Me",
                "artist"            : "Lounk",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166207.jpg",
                "albumName"         : "혼자가 편해 아님 둘",
                "artist"            : "홍갑",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "740953.jpg",
                "albumName"         : "항해",
                "artist"            : "동현종",
                "release"           : "2018.05.13",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165683.jpg",
                "albumName"         : "Magazine",
                "artist"            : "디얼라이프(Dear Life)",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164941.jpg",
                "albumName"         : "미치겠다 너땜에 (MBC 단막스페셜)",
                "artist"            : "성주",
                "release"           : "2018.05.08",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165203.jpg",
                "albumName"         : "RED",
                "artist"            : "하늘민(Haneulmin)",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165489.jpg",
                "albumName"         : "STACKIN",
                "artist"            : "시기펩(Siggie Feb)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165974.jpg",
                "albumName"         : "Coosebumps",
                "artist"            : "Coogie",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166861.jpg",
                "albumName"         : "GG",
                "artist"            : "POOKY(푸키)",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164513.jpg",
                "albumName"         : "천동아 최신트로트 메들리",
                "artist"            : "천동아",
                "release"           : "2018.05.09",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162284.jpg",
                "albumName"         : "Way Out",
                "artist"            : "더스(THUS)",
                "release"           : "2018.05.02",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167344.jpg",
                "albumName"         : "Fast Life",
                "artist"            : "8586",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165818.jpg",
                "albumName"         : "우울의 조각들",
                "artist"            : "MINSU",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166941.jpg",
                "albumName"         : "Little Forest",
                "artist"            : "성배",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166571.jpg",
                "albumName"         : "Hi",
                "artist"            : "Bravo(브라보)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20166956.jpg",
                "albumName"         : "송지현 싱글앨범 1집",
                "artist"            : "송지현(Song Ji Hyun)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162535.jpg",
                "albumName"         : "삼각관계",
                "artist"            : "콘치와 콘치즈",
                "release"           : "2018.04.25",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167328.jpg",
                "albumName"         : "Sax In The City",
                "artist"            : "제이슨 리(Jason Lee)",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165311.jpg",
                "albumName"         : "미로",
                "artist"            : "할라피노 칠린(Halapeno 7Lin)",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165351.jpg",
                "albumName"         : "봄",
                "artist"            : "수진",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20163731.jpg",
                "albumName"         : "빙글빙글 도는세상",
                "artist"            : "김봉희",
                "release"           : "2018.05.03",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166156.jpg",
                "albumName"         : "It's Over",
                "artist"            : "유은지",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165781.jpg",
                "albumName"         : "Good Day",
                "artist"            : "B. Bop",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165930.jpg",
                "albumName"         : "세.젤.예",
                "artist"            : "신기남",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "734372.jpg",
                "albumName"         : "rushour",
                "artist"            : "nuh",
                "release"           : "2018.04.20",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20166221.jpg",
                "albumName"         : "너 없는 시간들",
                "artist"            : "레몬",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164474.jpg",
                "albumName"         : "이 봄이",
                "artist"            : "선영",
                "release"           : "2018.05.09",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164370.jpg",
                "albumName"         : "Funleestyle",
                "artist"            : "FunLee",
                "release"           : "2018.05.04",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160016.jpg",
                "albumName"         : "Pare & Dance",
                "artist"            : "HIGH5",
                "release"           : "2018.04.13",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20166523.jpg",
                "albumName"         : "Tonight",
                "artist"            : "김완선",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166486.jpg",
                "albumName"         : "SQUALL",
                "artist"            : "Z A K U Z I",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164920.jpg",
                "albumName"         : "기름진 멜로 (SBS 월화드라마)",
                "artist"            : "정세운",
                "release"           : "2018.05.07",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161341.jpg",
                "albumName"         : "POPS GARDEN : 불멸의 명곡 산책",
                "artist"            : "MBC",
                "release"           : "2018.04.25",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166146.jpg",
                "albumName"         : "The Air",
                "artist"            : "Rosy",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166197.jpg",
                "albumName"         : "누구보다 더",
                "artist"            : "더 브릿지(The Bridge)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163624.jpg",
                "albumName"         : "Time for the moon night",
                "artist"            : "여자친구(GFRIEND)",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162765.jpg",
                "albumName"         : "True Love",
                "artist"            : "눈큰나라(Nunkunnara)",
                "release"           : "2018.04.26",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164794.jpg",
                "albumName"         : "세금천의 첫사랑",
                "artist"            : "이윤",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164918.jpg",
                "albumName"         : "I Help You",
                "artist"            : "투톤(Two Tone)",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160240.jpg",
                "albumName"         : "사랑은 어려워",
                "artist"            : "더 멜로디",
                "release"           : "2018.04.16",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166044.jpg",
                "albumName"         : "siri",
                "artist"            : "ness(네스)",
                "release"           : "2018.05.13",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159325.jpg",
                "albumName"         : "Evening",
                "artist"            : "엔서(Enswer)",
                "release"           : "2018.04.13",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165645.jpg",
                "albumName"         : "Pororo",
                "artist"            : "Yves",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162035.jpg",
                "albumName"         : "김승준1집",
                "artist"            : "김승준",
                "release"           : "2018.04.24",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164760.jpg",
                "albumName"         : "싱어송라이터 임근재 1st",
                "artist"            : "임근재",
                "release"           : "2018.05.04",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "741440.jpg",
                "albumName"         : "EDEN_STARDUST.01",
                "artist"            : "이든(EDEN)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162788.jpg",
                "albumName"         : "연애포차 (웹드라마) OST - Part.4",
                "artist"            : "엔플라잉(N.Flying)",
                "release"           : "2018.04.25",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166014.jpg",
                "albumName"         : "서투른 용기",
                "artist"            : "박테리아(Parkteria)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162193.jpg",
                "albumName"         : "더불어살거야 (We are the one)",
                "artist"            : "김성만",
                "release"           : "2018.04.26",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166267.jpg",
                "albumName"         : "미스트리스 (OCN 주말드라마)",
                "artist"            : "사비나앤드론즈",
                "release"           : "2018.05.13",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20166932.jpg",
                "albumName"         : "먼 길을 돌아",
                "artist"            : "위명운",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164792.jpg",
                "albumName"         : "기분 좋은날",
                "artist"            : "방설이",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165926.jpg",
                "albumName"         : "그리운 부산항",
                "artist"            : "김광수",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161535.jpg",
                "albumName"         : "넌 감동이었어",
                "artist"            : "에이미",
                "release"           : "2018.04.20",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163568.jpg",
                "albumName"         : "해피엔딩",
                "artist"            : "장연주",
                "release"           : "2018.04.30",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164258.jpg",
                "albumName"         : "봄바람 (spring breeze)",
                "artist"            : "김훈석",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163957.jpg",
                "albumName"         : "수평선",
                "artist"            : "고준경",
                "release"           : "2018.05.02",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164844.jpg",
                "albumName"         : "착한 마녀전(SBS 주말드라마) OST - Part.9",
                "artist"            : "김지영(메스그램)",
                "release"           : "2018.05.05",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166659.jpg",
                "albumName"         : "겨울에서 봄",
                "artist"            : "루이나",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166933.jpg",
                "albumName"         : "Journey",
                "artist"            : "김성윤",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166216.jpg",
                "albumName"         : "GRADATION Vol.1",
                "artist"            : "ELO",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165652.jpg",
                "albumName"         : "Good Bye",
                "artist"            : "레드판다(Red Panda)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165676.jpg",
                "albumName"         : "Hate Me Why",
                "artist"            : "제이켠(J'Kyun)",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166610.jpg",
                "albumName"         : "Stay",
                "artist"            : "르라보(Lelabo)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166564.jpg",
                "albumName"         : "비와 나",
                "artist"            : "노영석",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167055.jpg",
                "albumName"         : "비 오는 날엔",
                "artist"            : "플로라",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163106.jpg",
                "albumName"         : "졸려",
                "artist"            : "소담",
                "release"           : "2018.04.27",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "735273.jpg",
                "albumName"         : "Return",
                "artist"            : "노스폴725(Northpole725)",
                "release"           : "2018.04.24",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162764.jpg",
                "albumName"         : "다르게 (Differently)",
                "artist"            : "안젤라(Angela)",
                "release"           : "2018.04.30",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167133.jpg",
                "albumName"         : "지워지지 않아",
                "artist"            : "양의",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163985.jpg",
                "albumName"         : "연우의 통기타 이야기 11집",
                "artist"            : "최춘호",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166898.jpg",
                "albumName"         : "Myself?",
                "artist"            : "김그림",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166562.jpg",
                "albumName"         : "15",
                "artist"            : "구본웅(Ku Bon Woong)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165346.jpg",
                "albumName"         : "Famous!",
                "artist"            : "Kohway",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20161534.jpg",
                "albumName"         : "설레인다",
                "artist"            : "우리나라",
                "release"           : "2018.04.24",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163399.jpg",
                "albumName"         : "추리의 여왕2 (KBS2 수목드라마)",
                "artist"            : "정재욱",
                "release"           : "2018.04.28",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "741435.jpg",
                "albumName"         : "대군 (TV조선 토일드라마) OST",
                "artist"            : "TV조선",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165808.jpg",
                "albumName"         : "YOLO",
                "artist"            : "제이티(Jay T)",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166163.jpg",
                "albumName"         : "Fake Gold",
                "artist"            : "Mini.K(미니케이)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20159002.jpg",
                "albumName"         : "Dream Lover - C Flat Project",
                "artist"            : "오사무",
                "release"           : "2018.04.12",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167070.jpg",
                "albumName"         : "아무렇지 않니",
                "artist"            : "강정민",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166358.jpg",
                "albumName"         : "풀꽃",
                "artist"            : "메리(Mary)",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160716.jpg",
                "albumName"         : "Tears",
                "artist"            : "김유진",
                "release"           : "2018.04.18",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165938.jpg",
                "albumName"         : "Drift",
                "artist"            : "구하림",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164988.jpg",
                "albumName"         : "불후의 명곡 조용필을 노래하다 2",
                "artist"            : "MBC",
                "release"           : "2018.05.05",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166866.jpg",
                "albumName"         : "사랑아 인생아",
                "artist"            : "이느낌",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20160445.jpg",
                "albumName"         : "적당히 해",
                "artist"            : "보명",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167263.jpg",
                "albumName"         : "성전에 올라가는 노래",
                "artist"            : "김소중",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165836.jpg",
                "albumName"         : "레밴드 2집",
                "artist"            : "레밴드",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165933.jpg",
                "albumName"         : "너의 이름",
                "artist"            : "미쓰밋밋",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161889.jpg",
                "albumName"         : "Surge 7.4",
                "artist"            : "신설희",
                "release"           : "2018.04.25",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166770.jpg",
                "albumName"         : "오늘은",
                "artist"            : "달픈(Dalpeun)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166262.jpg",
                "albumName"         : "투유 프로젝트 - 슈가맨2 Part.17",
                "artist"            : "투유 프로젝트",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167336.jpg",
                "albumName"         : "Singing Love",
                "artist"            : "젤리프로젝트",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167329.jpg",
                "albumName"         : "고마운 사람",
                "artist"            : "샤붓",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164317.jpg",
                "albumName"         : "사랑은 주는거야",
                "artist"            : "문옥",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "736540.jpg",
                "albumName"         : "LOVE IS YOU",
                "artist"            : "홍대광",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166950.jpg",
                "albumName"         : "Music Is A Drug For Me",
                "artist"            : "YP",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166293.jpg",
                "albumName"         : "Credit",
                "artist"            : "인디고뮤직(Indigo Music)",
                "release"           : "2018.05.13",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20158037.jpg",
                "albumName"         : "NIER",
                "artist"            : "이건희",
                "release"           : "2018.04.05",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165689.jpg",
                "albumName"         : "Journey",
                "artist"            : "너드(N2rd)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166294.jpg",
                "albumName"         : "내 안의 너",
                "artist"            : "김의상",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165508.jpg",
                "albumName"         : "I'm sorry",
                "artist"            : "홈보이(Homeboy)",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166217.jpg",
                "albumName"         : "소확행",
                "artist"            : "스탠딩 에그(Standing Egg)",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166462.jpg",
                "albumName"         : "잊어본다",
                "artist"            : "박송이(Pak SongYi)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164953.jpg",
                "albumName"         : "삼선의원 OST",
                "artist"            : "4Bros",
                "release"           : "2018.05.05",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "740452.jpg",
                "albumName"         : "Nothing",
                "artist"            : "에이솔",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166254.jpg",
                "albumName"         : "어제의날씨",
                "artist"            : "온주완",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165492.jpg",
                "albumName"         : "HAHAEHO (하헤호)",
                "artist"            : "로삼(Losam)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165227.jpg",
                "albumName"         : "가지마",
                "artist"            : "은자",
                "release"           : "2018.05.09",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162034.jpg",
                "albumName"         : "김성찬1집",
                "artist"            : "김성찬",
                "release"           : "2018.04.25",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164979.jpg",
                "albumName"         : "비내리는 팽목항",
                "artist"            : "용화",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167033.jpg",
                "albumName"         : "Run Away From You",
                "artist"            : "멜트인멜트",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164546.jpg",
                "albumName"         : "I Will",
                "artist"            : "윤예슬이",
                "release"           : "2018.05.07",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166504.jpg",
                "albumName"         : "I love Walnut",
                "artist"            : "Saekim",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165575.jpg",
                "albumName"         : "City Of Grey",
                "artist"            : "그레이 데이(Grey Day)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163264.jpg",
                "albumName"         : "난리가 난리가 났네",
                "artist"            : "베리굿 하트하트",
                "release"           : "2018.04.27",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166131.jpg",
                "albumName"         : "점팔이 7080",
                "artist"            : "점팔이",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165022.jpg",
                "albumName"         : "운명",
                "artist"            : "이규석(Lee Kyu Suk)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167104.jpg",
                "albumName"         : "산책",
                "artist"            : "위은총",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159444.jpg",
                "albumName"         : "좀비송",
                "artist"            : "무적기타",
                "release"           : "2018.04.13",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162097.jpg",
                "albumName"         : "Oblivion",
                "artist"            : "FLASK(플라스크)",
                "release"           : "2018.05.04",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161213.jpg",
                "albumName"         : "DPOP STUDIO PROJECT Vol. 2",
                "artist"            : "디팝프렌즈(DPOP Friends)",
                "release"           : "2018.04.19",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164826.jpg",
                "albumName"         : "잊지 않을게",
                "artist"            : "스윗빈(Sweet Bean)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167262.jpg",
                "albumName"         : "잊고싶어",
                "artist"            : "에스프레소",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162077.jpg",
                "albumName"         : "CLOUD",
                "artist"            : "김민지",
                "release"           : "2018.04.30",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159970.jpg",
                "albumName"         : "Crossroad",
                "artist"            : "윤현석",
                "release"           : "2018.04.13",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166745.jpg",
                "albumName"         : "Move Away",
                "artist"            : "어반 코너(Urban Corner)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165339.jpg",
                "albumName"         : "월셋방의 꿈",
                "artist"            : "등가쿤",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164989.jpg",
                "albumName"         : "안고싶어",
                "artist"            : "어바웃어스 (About Us)",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165429.jpg",
                "albumName"         : "속도 좀 줄이거라 / 곰배령 / 당신이 준거야",
                "artist"            : "조은성",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166417.jpg",
                "albumName"         : "Yuppie",
                "artist"            : "김밥 마는 아줌마",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166957.jpg",
                "albumName"         : "Monster",
                "artist"            : "YCPLAYER",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165434.jpg",
                "albumName"         : "Today Is Happy Day",
                "artist"            : "La Pino",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160880.jpg",
                "albumName"         : "천벌",
                "artist"            : "임경화",
                "release"           : "2018.04.19",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165609.jpg",
                "albumName"         : "Rainy Day",
                "artist"            : "어몽(Among)",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164913.jpg",
                "albumName"         : "우리 산책할까요",
                "artist"            : "베리고라운드",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20161745.jpg",
                "albumName"         : "자우림 비긴어게인 - 포르투 라이브",
                "artist"            : "김윤아",
                "release"           : "2018.04.21",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166308.jpg",
                "albumName"         : "Em Guitar Solo, 1st Repertory, Letter [minor Chord]",
                "artist"            : "이재욱",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160006.jpg",
                "albumName"         : "Sexycuse Me",
                "artist"            : "시율",
                "release"           : "2018.04.13",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165435.jpg",
                "albumName"         : "보고싶다 어버이",
                "artist"            : "김국환",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166180.jpg",
                "albumName"         : "더 콜(The Call) 첫 번째 프로젝트",
                "artist"            : "더 콜",
                "release"           : "2018.05.12",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167021.jpg",
                "albumName"         : "영어시간",
                "artist"            : "조순종",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164860.jpg",
                "albumName"         : "The Gotland Session",
                "artist"            : "Magnus Ringblom",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164197.jpg",
                "albumName"         : "알게뭐야",
                "artist"            : "루이(RUI)",
                "release"           : "2018.05.03",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166778.jpg",
                "albumName"         : "너에게",
                "artist"            : "프로키온(Procyon)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "742695.jpg",
                "albumName"         : "사뿐사뿐 (EDM ver.)",
                "artist"            : "후니용이",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166672.jpg",
                "albumName"         : "My Frank Feelings",
                "artist"            : "멜트인멜트",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166690.jpg",
                "albumName"         : "Before & After",
                "artist"            : "카카오박",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163369.jpg",
                "albumName"         : "나만의 여자",
                "artist"            : "엔아이",
                "release"           : "2018.04.30",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164983.jpg",
                "albumName"         : "복면가왕 152회",
                "artist"            : "MBC",
                "release"           : "2018.05.06",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165426.jpg",
                "albumName"         : "정거장 / 가슴에 남은 사랑",
                "artist"            : "윤철",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164909.jpg",
                "albumName"         : "파이팅 김여사",
                "artist"            : "치로치로아카데미",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166519.jpg",
                "albumName"         : "음악이 흐르는 카페에서",
                "artist"            : "선유선",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161023.jpg",
                "albumName"         : "EAU DE VIXX",
                "artist"            : "빅스(VIXX)",
                "release"           : "2018.04.17",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165256.jpg",
                "albumName"         : "Hazelnuts",
                "artist"            : "Sweet Jazz",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165688.jpg",
                "albumName"         : "춘곤 (春gone)",
                "artist"            : "웨이엘",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166459.jpg",
                "albumName"         : "훈장질",
                "artist"            : "올드스쿨티쳐(Old School Teacher)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163903.jpg",
                "albumName"         : "GIRLS BE THE BEST",
                "artist"            : "GBB(지비비)",
                "release"           : "2018.05.01",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "737513.jpg",
                "albumName"         : "ANGEL",
                "artist"            : "아이즈(IZ)",
                "release"           : "2018.05.01",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "740852.jpg",
                "albumName"         : "이별저울",
                "artist"            : "구본석",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165986.jpg",
                "albumName"         : "팔베개",
                "artist"            : "백설우",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159966.jpg",
                "albumName"         : "눈에는 눈 이에는 이",
                "artist"            : "한방 프로젝트",
                "release"           : "2018.04.13",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164914.jpg",
                "albumName"         : "A Present For You",
                "artist"            : "엘피레코드",
                "release"           : "2018.05.08",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164502.jpg",
                "albumName"         : "그림자",
                "artist"            : "신디",
                "release"           : "2018.05.04",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167241.jpg",
                "albumName"         : "가요공감 3집",
                "artist"            : "현준",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164609.jpg",
                "albumName"         : "돌진, 알파고!",
                "artist"            : "Amazing Visual(어메이징 비주얼)",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166467.jpg",
                "albumName"         : "Love In Jazz",
                "artist"            : "클라우디오 트리오(Cloudio Trio)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165941.jpg",
                "albumName"         : "너는 너라서",
                "artist"            : "위미션(Wemission)",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166318.jpg",
                "albumName"         : "Time Of The Day",
                "artist"            : "베리고라운드",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166372.jpg",
                "albumName"         : "시작",
                "artist"            : "조태준",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166093.jpg",
                "albumName"         : "Make It Happen",
                "artist"            : "오상호 Nonet(Oh Sangho Nonet)",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164823.jpg",
                "albumName"         : "나야 Lovely Trot Vol. 1",
                "artist"            : "나야",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162434.jpg",
                "albumName"         : "Mood Swing",
                "artist"            : "영 암스테르담 (YOUNG AMSTERDAM)",
                "release"           : "2018.04.27",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164814.jpg",
                "albumName"         : "그리움",
                "artist"            : "소울네오(Soulneo)",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167029.jpg",
                "albumName"         : "아니야",
                "artist"            : "라미스",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165640.jpg",
                "albumName"         : "Since",
                "artist"            : "미스틱하트",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167193.jpg",
                "albumName"         : "내가싫어하는노래",
                "artist"            : "Aimer",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164092.jpg",
                "albumName"         : "일탈할래",
                "artist"            : "디아이(D+I)",
                "release"           : "2018.05.03",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164240.jpg",
                "albumName"         : "I am",
                "artist"            : "(여자)아이들",
                "release"           : "2018.05.02",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164625.jpg",
                "albumName"         : "자우림 비긴어게인 - 리스본 라이브",
                "artist"            : "김윤아",
                "release"           : "2018.05.05",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166855.jpg",
                "albumName"         : "RED",
                "artist"            : "Roof Top",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166955.jpg",
                "albumName"         : "Half Noodle",
                "artist"            : "llaBin",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165132.jpg",
                "albumName"         : "어떤밤",
                "artist"            : "우용(WOOYONG)",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163830.jpg",
                "albumName"         : "니가 예뻐서 문제야",
                "artist"            : "남사친",
                "release"           : "2018.05.02",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162777.jpg",
                "albumName"         : "드라마틱 (Dramatic)",
                "artist"            : "마이달링 (My Darling)",
                "release"           : "2018.04.26",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165305.jpg",
                "albumName"         : "당신과 나의 사이에는",
                "artist"            : "피노(Pino)",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162884.jpg",
                "albumName"         : "마이티 바운스 (Mighty Bounce)",
                "artist"            : "터보트로닉(Turbotronic)",
                "release"           : "2018.04.27",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165977.jpg",
                "albumName"         : "Rockstar",
                "artist"            : "Zeck",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164796.jpg",
                "albumName"         : "투유 프로젝트 - 슈가맨2 Part.16",
                "artist"            : "케이윌",
                "release"           : "2018.05.07",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162662.jpg",
                "albumName"         : "분홍이 끓기 시작할 때",
                "artist"            : "플로녹스(FlonoX)",
                "release"           : "2018.04.27",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162341.jpg",
                "albumName"         : "BLOSSOM",
                "artist"            : "스누퍼(SNUPER)",
                "release"           : "2018.04.24",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166495.jpg",
                "albumName"         : "별 하나씩 세다",
                "artist"            : "조건국",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166546.jpg",
                "albumName"         : "첫사랑",
                "artist"            : "섬(Sum)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20157201.jpg",
                "albumName"         : "거부기의 꿈",
                "artist"            : "앨리(Ally)",
                "release"           : "2018.04.03",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160045.jpg",
                "albumName"         : "Can",
                "artist"            : "Jeren",
                "release"           : "2018.04.15",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165278.jpg",
                "albumName"         : "Call Me",
                "artist"            : "Silzzang kim(실장킴)",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165012.jpg",
                "albumName"         : "One More",
                "artist"            : "에이돕(A.Dope)",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20158796.jpg",
                "albumName"         : "무중력",
                "artist"            : "리주(LeeZu)",
                "release"           : "2018.04.19",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162575.jpg",
                "albumName"         : "스위치-세상을 바꿔라(SBS수목드라마)",
                "artist"            : "이홍기",
                "release"           : "2018.04.25",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166281.jpg",
                "albumName"         : "슬픈 안녕",
                "artist"            : "경우현",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164008.jpg",
                "albumName"         : "보랏빛 그대",
                "artist"            : "김달봉",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165090.jpg",
                "albumName"         : "Sky Height",
                "artist"            : "Nuevo Trio(누에보 트리오)",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166153.jpg",
                "albumName"         : "탓",
                "artist"            : "제이넥(JNecK)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164510.jpg",
                "albumName"         : "Remaster Screen Music Collection",
                "artist"            : "이미자",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167124.jpg",
                "albumName"         : "정현숙 디지털싱글",
                "artist"            : "정현숙",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165536.jpg",
                "albumName"         : "long way",
                "artist"            : "페퍼톤스(Peppertones)",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "737484.jpg",
                "albumName"         : "Balloon",
                "artist"            : "메이다니(MAYDONI)",
                "release"           : "2018.05.02",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163548.jpg",
                "albumName"         : "다 잊었다고",
                "artist"            : "자스민",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167285.jpg",
                "albumName"         : "비트코인",
                "artist"            : "DJ Pophead",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167175.jpg",
                "albumName"         : "HD",
                "artist"            : "HD Beatz",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "737112.jpg",
                "albumName"         : "대군 (TV조선 토일드라마) OST - 三劃 (삼획)",
                "artist"            : "임지은",
                "release"           : "2018.04.28",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167028.jpg",
                "albumName"         : "내 기억 속에",
                "artist"            : "데이지",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20166239.jpg",
                "albumName"         : "Baby Closer",
                "artist"            : "NewTownBoyz(뉴타운보이즈)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164350.jpg",
                "albumName"         : "메아리",
                "artist"            : "정석환",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166329.jpg",
                "albumName"         : "시간이 멈췄어",
                "artist"            : "루오(Luo)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164980.jpg",
                "albumName"         : "님이좋아 / 눈치코치 / 대마도",
                "artist"            : "애국소녀 은샘",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166576.jpg",
                "albumName"         : "Fourth Floor Window",
                "artist"            : "조희철",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166003.jpg",
                "albumName"         : "흑백도시",
                "artist"            : "유은찬",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167062.jpg",
                "albumName"         : "잘나가는 최신 민요 디스코",
                "artist"            : "선유선",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166155.jpg",
                "albumName"         : "호수",
                "artist"            : "카운트(Count)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165811.jpg",
                "albumName"         : "Like it",
                "artist"            : "에이로우 (ALow)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166259.jpg",
                "albumName"         : "알 수 있던 이별에서",
                "artist"            : "임가영",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164964.jpg",
                "albumName"         : "술꾼도시처녀들 (웹툰) OST",
                "artist"            : "미란(Miran)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166319.jpg",
                "albumName"         : "POOL[pu:l]",
                "artist"            : "WOODZ",
                "release"           : "2018.05.12",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166994.jpg",
                "albumName"         : "우리 헤어졌어요 OST (2018 Remaster)",
                "artist"            : "이혜림",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163770.jpg",
                "albumName"         : "Stay With Me",
                "artist"            : "라파엘(홍석준)",
                "release"           : "2018.05.02",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165897.jpg",
                "albumName"         : "Wavy-!",
                "artist"            : "어나니머스아티스트(Anonymous Artists)",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167443.jpg",
                "albumName"         : "말 걸지 마",
                "artist"            : "하곤",
                "release"           : "2018.05.18",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161128.jpg",
                "albumName"         : "Perfect",
                "artist"            : "제이플라(J.Fla)",
                "release"           : "2018.04.23",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20156350.jpg",
                "albumName"         : "Subway Flood",
                "artist"            : "Downhill from here",
                "release"           : "2018.04.02",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165675.jpg",
                "albumName"         : "함부로 찾아 온 이별에 나는 침묵했다",
                "artist"            : "유시경",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162590.jpg",
                "albumName"         : "Friends",
                "artist"            : "제이플라(J.Fla)",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159463.jpg",
                "albumName"         : "하나",
                "artist"            : "써드프렌(THIRDFRIEND)",
                "release"           : "2018.04.12",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164975.jpg",
                "albumName"         : "십일홍",
                "artist"            : "김선빈",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167209.jpg",
                "albumName"         : "Pools",
                "artist"            : "WADE",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20162923.jpg",
                "albumName"         : "지금 이 순간부터",
                "artist"            : "황푸하",
                "release"           : "2018.04.28",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165849.jpg",
                "albumName"         : "악몽·Escape the ERA",
                "artist"            : "드림캐쳐(Dreamcatcher)",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166324.jpg",
                "albumName"         : "저 언덕을 넘어서면",
                "artist"            : "엘피레코드",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164812.jpg",
                "albumName"         : "조화에도 물을 주며",
                "artist"            : "달탐사소년단",
                "release"           : "2018.05.06",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162761.jpg",
                "albumName"         : "Geranium",
                "artist"            : "TRAIL LINER(트레일라이너)",
                "release"           : "2018.04.30",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162680.jpg",
                "albumName"         : "You And I",
                "artist"            : "베리포(berry4)",
                "release"           : "2018.04.27",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162301.jpg",
                "albumName"         : "사랑의 택배기사",
                "artist"            : "박시원",
                "release"           : "2018.04.25",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20164928.jpg",
                "albumName"         : "White Chocolate",
                "artist"            : "SS",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165684.jpg",
                "albumName"         : "꼭 이래요",
                "artist"            : "문사운드(Moon Sound)",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167286.jpg",
                "albumName"         : "슈츠 (KBS2 수목드라마) OST",
                "artist"            : "강민경",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166754.jpg",
                "albumName"         : "World Is Mine",
                "artist"            : "김효은",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164204.jpg",
                "albumName"         : "모닝콜을 부탁해",
                "artist"            : "유아 (오마이걸)",
                "release"           : "2018.05.02",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160244.jpg",
                "albumName"         : "She’s on fire",
                "artist"            : "IN&CHOO",
                "release"           : "2018.04.16",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164910.jpg",
                "albumName"         : "우리사이",
                "artist"            : "재영",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165357.jpg",
                "albumName"         : "BGM Jazz Library_122",
                "artist"            : "Do&Be Sound",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167022.jpg",
                "albumName"         : "연연 (戀戀)",
                "artist"            : "김구수",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165604.jpg",
                "albumName"         : "Cat's Name Is Choco",
                "artist"            : "윈디캣(WindyCat)",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166178.jpg",
                "albumName"         : "아픈 이별, 잊지 말아요",
                "artist"            : "정은비",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164537.jpg",
                "albumName"         : "Love is Magic",
                "artist"            : "멜로위치(Mellowitch)",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165101.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "빨간의자",
                "release"           : "2018.05.08",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166944.jpg",
                "albumName"         : "수요일 #23",
                "artist"            : "Soul Sweet(소울 스윗)",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166833.jpg",
                "albumName"         : "이 별에서 이별하는 중에",
                "artist"            : "소라",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165394.jpg",
                "albumName"         : "여행",
                "artist"            : "정화",
                "release"           : "2018.05.11",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "742693.jpg",
                "albumName"         : "Beatcamp vol.3",
                "artist"            : "GoodBGM",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160031.jpg",
                "albumName"         : "갈증 (Thirst)",
                "artist"            : "매드 클라운(Mad Clown)",
                "release"           : "2018.04.12",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "737487.jpg",
                "albumName"         : "내 삶은 빛나기 시작했다",
                "artist"            : "심수봉",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163482.jpg",
                "albumName"         : "브레이커스 Part.2",
                "artist"            : "페노메코(PENOMECO)",
                "release"           : "2018.04.28",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165119.jpg",
                "albumName"         : "Don't Worry, Cheer Up!",
                "artist"            : "필리핀 바나나",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20166370.jpg",
                "albumName"         : "Move",
                "artist"            : "블레임룩(Blame look)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162229.jpg",
                "albumName"         : "이창휘, 권용욱 리메이크",
                "artist"            : "이창휘",
                "release"           : "2018.04.25",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "738034.jpg",
                "albumName"         : "말풍선이 보여",
                "artist"            : "밀당남녀",
                "release"           : "2018.05.03",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165563.jpg",
                "albumName"         : "그 소리",
                "artist"            : "37",
                "release"           : "2018.05.13",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165612.jpg",
                "albumName"         : "미운정 고운정",
                "artist"            : "정미진",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164552.jpg",
                "albumName"         : "인형의 집(KBS 일일드라마)",
                "artist"            : "세리(달샤벳)",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163821.jpg",
                "albumName"         : "O.M.G.",
                "artist"            : "헤일로(HALO)",
                "release"           : "2018.05.01",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "740729.jpg",
                "albumName"         : "GLACK",
                "artist"            : "델모(Del.Mo)",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166052.jpg",
                "albumName"         : "한사람",
                "artist"            : "김상우",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20165599.jpg",
                "albumName"         : "Pop Power",
                "artist"            : "블랙언더그라운드",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164352.jpg",
                "albumName"         : "The Muse No.3",
                "artist"            : "황지효(HWANG JI HYO)",
                "release"           : "2018.05.03",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20159901.jpg",
                "albumName"         : "My Style",
                "artist"            : "체리파이",
                "release"           : "2018.04.13",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20167094.jpg",
                "albumName"         : "1집 사랑이라는 것",
                "artist"            : "닻(Anchor)",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167035.jpg",
                "albumName"         : "Cool",
                "artist"            : "미스틱하트",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166051.jpg",
                "albumName"         : "BGM Jazz Library_123",
                "artist"            : "Do&Be Sound",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20163992.jpg",
                "albumName"         : "노모의 유서",
                "artist"            : "유승엽",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165529.jpg",
                "albumName"         : "비트테잎 April 2018",
                "artist"            : "어거스트",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165337.jpg",
                "albumName"         : "Be Born",
                "artist"            : "스펙트럼",
                "release"           : "2018.05.09",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162609.jpg",
                "albumName"         : "어쿠스틱 플러스원 Vol.12",
                "artist"            : "정단",
                "release"           : "2018.04.26",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165496.jpg",
                "albumName"         : "Aurora (I'm In)",
                "artist"            : "이옐(2.Yell)",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164490.jpg",
                "albumName"         : "삐용삐용",
                "artist"            : "김미사",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165592.jpg",
                "albumName"         : "물처럼 바람처럼",
                "artist"            : "박우철",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164003.jpg",
                "albumName"         : "부르스 그대여",
                "artist"            : "성경",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166987.jpg",
                "albumName"         : "Blood Ink",
                "artist"            : "24 Flakko",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166292.jpg",
                "albumName"         : "SANG SANG (想象)",
                "artist"            : "HIZY",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166415.jpg",
                "albumName"         : "As Well As",
                "artist"            : "김밥 마는 아줌마",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164549.jpg",
                "albumName"         : "사랑때문에",
                "artist"            : "오지원",
                "release"           : "2018.05.09",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159636.jpg",
                "albumName"         : "오랜 기다림 2",
                "artist"            : "우인배",
                "release"           : "2018.04.12",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166140.jpg",
                "albumName"         : "Jazz Bar With You",
                "artist"            : "Gallery.T",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166346.jpg",
                "albumName"         : "맞장구",
                "artist"            : "박현성",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20165338.jpg",
                "albumName"         : "그대에게",
                "artist"            : "유요한(Yooyohan)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166507.jpg",
                "albumName"         : "Rain Outside The Window",
                "artist"            : "흑꼬",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164371.jpg",
                "albumName"         : "영종도",
                "artist"            : "혹시몰라(Hoksimolla)",
                "release"           : "2018.05.04",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165556.jpg",
                "albumName"         : "Ohh Spring",
                "artist"            : "비쥬(Bijou)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20166619.jpg",
                "albumName"         : "잠깐이면돼",
                "artist"            : "김강진",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164811.jpg",
                "albumName"         : "부디 곱게 늙어주시오 / 회상",
                "artist"            : "스님 묘광",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165863.jpg",
                "albumName"         : "PRODUCE 48 - 내꺼야 (PICK ME)",
                "artist"            : "PRODUCE 48",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "741192.jpg",
                "albumName"         : "잠이 오지가 않아",
                "artist"            : "케이플라워(K.Flower)",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167236.jpg",
                "albumName"         : "가요공감 1집",
                "artist"            : "현준",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163116.jpg",
                "albumName"         : "ONE",
                "artist"            : "MadB광종(매드비광종)",
                "release"           : "2018.05.01",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163025.jpg",
                "albumName"         : "Blossom",
                "artist"            : "해리(Harry)",
                "release"           : "2018.04.30",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167083.jpg",
                "albumName"         : "내성적인 EP vol.1",
                "artist"            : "ESBEE",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163020.jpg",
                "albumName"         : "중2병 (8th Grade Syndrome)",
                "artist"            : "하이큐티(HI CUTIE)",
                "release"           : "2018.05.02",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164893.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "울랄라세션(Ulala Session)",
                "release"           : "2018.05.07",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164303.jpg",
                "albumName"         : "님과 함께",
                "artist"            : "볼파란삼춘들",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164517.jpg",
                "albumName"         : "Cold Fire",
                "artist"            : "PREP(프렙)",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166280.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "김성리",
                "release"           : "2018.05.13",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161955.jpg",
                "albumName"         : "4월 23일 설레고 막 그럼",
                "artist"            : "몽당연필",
                "release"           : "2018.04.23",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163300.jpg",
                "albumName"         : "언제 올래",
                "artist"            : "자이로(zai.ro)",
                "release"           : "2018.04.27",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165925.jpg",
                "albumName"         : "내일도 맑음(KBS1 일일드라마)",
                "artist"            : "금조(나인뮤지스)",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164035.jpg",
                "albumName"         : "너와 나, 함께한 이야기",
                "artist"            : "Q.nine",
                "release"           : "2018.05.13",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163968.jpg",
                "albumName"         : "My Paradise",
                "artist"            : "그루비룸 (GroovyRoom)",
                "release"           : "2018.04.30",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167061.jpg",
                "albumName"         : "BGM Jazz Library_124",
                "artist"            : "Do&Be Sound",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165510.jpg",
                "albumName"         : "A Scandinavian Thing",
                "artist"            : "Peter Sandberg",
                "release"           : "2018.05.10",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163224.jpg",
                "albumName"         : "One",
                "artist"            : "Wish(위쉬)",
                "release"           : "2018.05.02",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166864.jpg",
                "albumName"         : "Mellow",
                "artist"            : "1215",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166773.jpg",
                "albumName"         : "그렇게",
                "artist"            : "전병준",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165323.jpg",
                "albumName"         : "네가 보여",
                "artist"            : "YP",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167284.jpg",
                "albumName"         : "Need U",
                "artist"            : "Saula",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167031.jpg",
                "albumName"         : "모를 거야",
                "artist"            : "리마크",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166142.jpg",
                "albumName"         : "Vintage Luv",
                "artist"            : "Daye",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165890.jpg",
                "albumName"         : "언제나 청춘",
                "artist"            : "지현",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166219.jpg",
                "albumName"         : "Perfumer",
                "artist"            : "Keylight(키라이트)",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167239.jpg",
                "albumName"         : "제일 아름답다",
                "artist"            : "구본웅(Ku Bon Woong)",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20160431.jpg",
                "albumName"         : "Blue Hole",
                "artist"            : "올가닉 시티(Organic City)",
                "release"           : "2018.04.23",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164598.jpg",
                "albumName"         : "찜",
                "artist"            : "빛나리",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165825.jpg",
                "albumName"         : "Eclair (Feat. Hieut)",
                "artist"            : "락타(LAKTA)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165782.jpg",
                "albumName"         : "Amore",
                "artist"            : "LENATAR(레나타)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166496.jpg",
                "albumName"         : "서울소녀",
                "artist"            : "리온(lion)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163578.jpg",
                "albumName"         : "불후의 명곡 조용필을 노래하다",
                "artist"            : "MBC",
                "release"           : "2018.04.28",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165128.jpg",
                "albumName"         : "ZERO",
                "artist"            : "크로스진(CROSS GENE)",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165023.jpg",
                "albumName"         : "Swimming in the party",
                "artist"            : "Timmy Room",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164189.jpg",
                "albumName"         : "My Little Girl",
                "artist"            : "NORMS(놈스)",
                "release"           : "2018.05.08",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166184.jpg",
                "albumName"         : "70-80 가요사랑 2",
                "artist"            : "완흥",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165522.jpg",
                "albumName"         : "Rainy Night",
                "artist"            : "카페 디아르떼(Cafe D'arte)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166301.jpg",
                "albumName"         : "아빠차",
                "artist"            : "한두(HANDOO)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164011.jpg",
                "albumName"         : "서해바다",
                "artist"            : "태규",
                "release"           : "2018.05.04",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166326.jpg",
                "albumName"         : "돌아봐줘요",
                "artist"            : "자스민",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166500.jpg",
                "albumName"         : "And, We",
                "artist"            : "정홍(Jeonghong)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167603.jpg",
                "albumName"         : "잊는연습",
                "artist"            : "알비(R.B)",
                "release"           : "2018.05.18",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166674.jpg",
                "albumName"         : "내 사랑 댕댕이",
                "artist"            : "몽당연필",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163209.jpg",
                "albumName"         : "Vacation",
                "artist"            : "OTHANKQ(오땡큐)",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20165225.jpg",
                "albumName"         : "SEOUL NIGHT",
                "artist"            : "틴 탑(Teen Top)",
                "release"           : "2018.05.08",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166867.jpg",
                "albumName"         : "ANYWHERE",
                "artist"            : "베스터(Bester)",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166644.jpg",
                "albumName"         : "She's My Angel",
                "artist"            : "저지 브라더(Jersey Brother)",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167444.jpg",
                "albumName"         : "Let's Get Lost",
                "artist"            : "소피야(Sophiya)",
                "release"           : "2018.05.18",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20157858.jpg",
                "albumName"         : "Moriah",
                "artist"            : "Tools in His Hands",
                "release"           : "2018.04.05",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166569.jpg",
                "albumName"         : "그저",
                "artist"            : "태리(Terry)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166013.jpg",
                "albumName"         : "Lost",
                "artist"            : "민주",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166330.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "코다 브릿지(Coda Bridge)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166965.jpg",
                "albumName"         : "Me (Mutant's excuse)",
                "artist"            : "뉴챔프",
                "release"           : "2018.05.15",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165953.jpg",
                "albumName"         : "53",
                "artist"            : "안치환",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166368.jpg",
                "albumName"         : "뒤죽박죽 인생 / 내꺼야 / 꽃잎",
                "artist"            : "신주희",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166856.jpg",
                "albumName"         : "그대가 되고파요",
                "artist"            : "규형근",
                "release"           : "2018.05.16",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166501.jpg",
                "albumName"         : "Work",
                "artist"            : "Syler",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165103.jpg",
                "albumName"         : "성휴 3rd (Prod.권노해만)",
                "artist"            : "성휴(Seong Hyu)",
                "release"           : "2018.05.11",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20167288.jpg",
                "albumName"         : "사랑아 사랑아",
                "artist"            : "박세령",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165368.jpg",
                "albumName"         : "작은 별",
                "artist"            : "사탕수수",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20163452.jpg",
                "albumName"         : "김큰산 내 사랑 부산",
                "artist"            : "김큰산",
                "release"           : "2018.05.04",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20162927.jpg",
                "albumName"         : "등산",
                "artist"            : "하율(Ha Yul)",
                "release"           : "2018.05.02",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165268.jpg",
                "albumName"         : "Tell Mommy",
                "artist"            : "Antree",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165973.jpg",
                "albumName"         : "Step Out Of",
                "artist"            : "HAMA(하마)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166289.jpg",
                "albumName"         : "아름다운 봄",
                "artist"            : "이재웅",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166275.jpg",
                "albumName"         : "너에게 (To You)",
                "artist"            : "윤아(YOONA)",
                "release"           : "2018.05.13",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167325.jpg",
                "albumName"         : "Sweet Talk",
                "artist"            : "비비드피넛",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163419.jpg",
                "albumName"         : "역류 (MBC 일일드라마)",
                "artist"            : "김은비",
                "release"           : "2018.04.28",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167134.jpg",
                "albumName"         : "Eternally",
                "artist"            : "상우(CHUCK)",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20157735.jpg",
                "albumName"         : "아버지의 일기",
                "artist"            : "파동밴드",
                "release"           : "2018.04.04",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165861.jpg",
                "albumName"         : "70-80 가요사랑 1",
                "artist"            : "완흥",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165741.jpg",
                "albumName"         : "Good Night",
                "artist"            : "RZQ",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166583.jpg",
                "albumName"         : "Fishery",
                "artist"            : "GoLP(골프)",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164629.jpg",
                "albumName"         : "참 오랜만이야",
                "artist"            : "송다온(Songdaon)",
                "release"           : "2018.05.08",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166849.jpg",
                "albumName"         : "Tattoo",
                "artist"            : "Tommy $trate",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165088.jpg",
                "albumName"         : "Spring Landscape",
                "artist"            : "Groove Hands",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20166981.jpg",
                "albumName"         : "우리 함께 시작하는 이 순간",
                "artist"            : "스탑스(Stops)",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166929.jpg",
                "albumName"         : "끝나지 않은 이야기",
                "artist"            : "이예준",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166355.jpg",
                "albumName"         : "Lucy In The Sky",
                "artist"            : "제이문(Jay Moon)",
                "release"           : "2018.05.13",
                "price"             : "15000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163651.jpg",
                "albumName"         : "붉은 아이",
                "artist"            : "자왕",
                "release"           : "2018.05.04",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166341.jpg",
                "albumName"         : "Disconnected",
                "artist"            : "오카디(OKA.D)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166506.jpg",
                "albumName"         : "Kim Sung Kyu SHINE Live",
                "artist"            : "김성규",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164310.jpg",
                "albumName"         : "인생이란 (Life Is)",
                "artist"            : "한담희",
                "release"           : "2018.05.03",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164535.jpg",
                "albumName"         : "어케해요",
                "artist"            : "계이름뱅이",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167320.jpg",
                "albumName"         : "언젠가는 그 날",
                "artist"            : "루하",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166593.jpg",
                "albumName"         : "글리터",
                "artist"            : "죠수아(JhosooA)",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162843.jpg",
                "albumName"         : "미워도 사랑해 (KBS1 일일드라마)",
                "artist"            : "비비안(BBAhn)",
                "release"           : "2018.04.26",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20164262.jpg",
                "albumName"         : "여리고 허무한",
                "artist"            : "THE PUNK DRUNK LOVE",
                "release"           : "2018.05.03",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166307.jpg",
                "albumName"         : "I Miss Redsox",
                "artist"            : "Luri",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20163225.jpg",
                "albumName"         : "부바르디아",
                "artist"            : "에이키스(A-KISS)",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165238.jpg",
                "albumName"         : "이리와봐요 / 감기처럼",
                "artist"            : "명보라",
                "release"           : "2018.05.14",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165959.jpg",
                "albumName"         : "한계 (Push All Limit)",
                "artist"            : "테크진(Techzin)",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164475.jpg",
                "albumName"         : "완충남",
                "artist"            : "이기태",
                "release"           : "2018.05.08",
                "price"             : "15000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161907.jpg",
                "albumName"         : "천년친구",
                "artist"            : "신달래",
                "release"           : "2018.04.24",
                "price"             : "11000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166364.jpg",
                "albumName"         : "You, I",
                "artist"            : "서주",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164572.jpg",
                "albumName"         : "연지곤지",
                "artist"            : "문연지",
                "release"           : "2018.05.03",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162259.jpg",
                "albumName"         : "Lovelyz 4th Mini Album",
                "artist"            : "러블리즈(Lovelyz)",
                "release"           : "2018.04.23",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166298.jpg",
                "albumName"         : "Talk about",
                "artist"            : "빈센트(Vincent)",
                "release"           : "2018.05.14",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167102.jpg",
                "albumName"         : "Dropdabeat",
                "artist"            : "에드워드 렉터(Edward Lecter)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167200.jpg",
                "albumName"         : "펑펑 울었어",
                "artist"            : "하현곤팩토리",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "738632.jpg",
                "albumName"         : "바람이 불어오는 곳",
                "artist"            : "오연준",
                "release"           : "2018.05.07",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163728.jpg",
                "albumName"         : "모던 클래식",
                "artist"            : "ii(아이아이)",
                "release"           : "2018.05.01",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20164358.jpg",
                "albumName"         : "Dear.",
                "artist"            : "안젤라(Angela)",
                "release"           : "2018.05.09",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167139.jpg",
                "albumName"         : "Flower In The City",
                "artist"            : "모던 스윙즈(Modern Swings)",
                "release"           : "2018.05.17",
                "price"             : "13000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159096.jpg",
                "albumName"         : "니가보고싶어",
                "artist"            : "피아니카",
                "release"           : "2018.04.12",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166235.jpg",
                "albumName"         : "Fantastic Joker's Musik Story",
                "artist"            : "아덴(Arden)",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20167051.jpg",
                "albumName"         : "장트라볼타",
                "artist"            : "젤리프로젝트",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164315.jpg",
                "albumName"         : "친구같은 내 사랑",
                "artist"            : "김진호",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166661.jpg",
                "albumName"         : "그래도 좋아",
                "artist"            : "루하",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20161255.jpg",
                "albumName"         : "#3 Re-Wined",
                "artist"            : "조대득 밴드",
                "release"           : "2018.04.23",
                "price"             : "15000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165932.jpg",
                "albumName"         : "#5",
                "artist"            : "류준영",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161815.jpg",
                "albumName"         : "첫 번째 재롱잔치",
                "artist"            : "콧수염 유치원",
                "release"           : "2018.04.25",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166653.jpg",
                "albumName"         : "가져가",
                "artist"            : "편태원",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165686.jpg",
                "albumName"         : "Through The Night",
                "artist"            : "Leiko Blue",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164840.jpg",
                "albumName"         : "이애란 백년의 길",
                "artist"            : "이애란",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164723.jpg",
                "albumName"         : "The Love Story Is Joo Ah Jin",
                "artist"            : "주아진(Joo Ah Jin)",
                "release"           : "2018.05.08",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167332.jpg",
                "albumName"         : "2018 월간 윤종신 5월호",
                "artist"            : "윤종신",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166971.jpg",
                "albumName"         : "그렇게 그대를",
                "artist"            : "마리아주(Mariage)",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160591.jpg",
                "albumName"         : "2nd Mini Album-Teen Love",
                "artist"            : "하이틴(Highteen)",
                "release"           : "2018.04.18",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166322.jpg",
                "albumName"         : "북두칠성",
                "artist"            : "방혁",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166599.jpg",
                "albumName"         : "시작",
                "artist"            : "노사연",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20161077.jpg",
                "albumName"         : "A Second Hand",
                "artist"            : "WoogieD(우기디)",
                "release"           : "2018.04.18",
                "price"             : "20000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20163193.jpg",
                "albumName"         : "Liar",
                "artist"            : "iloi",
                "release"           : "2018.04.25",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166574.jpg",
                "albumName"         : "텅 빈 오늘",
                "artist"            : "물고기꿈",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167249.jpg",
                "albumName"         : "에버그린",
                "artist"            : "소낙빌",
                "release"           : "2018.05.17",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166360.jpg",
                "albumName"         : "PAPER",
                "artist"            : "쿤타(Koonta)",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20162986.jpg",
                "albumName"         : "You'll Never Walk Alone",
                "artist"            : "앨리(Ally)",
                "release"           : "2018.04.27",
                "price"             : "20000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167242.jpg",
                "albumName"         : "Come Back",
                "artist"            : "Minor Square",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165131.jpg",
                "albumName"         : "Scene. 5",
                "artist"            : "그레이필름(Grayfilm)",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20163990.jpg",
                "albumName"         : "남자의 약속",
                "artist"            : "유신지",
                "release"           : "2018.05.04",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "733772.jpg",
                "albumName"         : "OASIS",
                "artist"            : "소야 (SOYA)",
                "release"           : "2018.04.18",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164960.jpg",
                "albumName"         : "캐논 변주곡 모음집",
                "artist"            : "클래식 리메이크",
                "release"           : "2018.05.09",
                "price"             : "20000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20165534.jpg",
                "albumName"         : "내 인생은 사계절",
                "artist"            : "서한범(Seo Han Bom)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166966.jpg",
                "albumName"         : "Farewell",
                "artist"            : "퍼스트 에이드(First Aid)",
                "release"           : "2018.05.16",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20160494.jpg",
                "albumName"         : "빛나",
                "artist"            : "임팩트",
                "release"           : "2018.04.17",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165674.jpg",
                "albumName"         : "유치해볼까",
                "artist"            : "H-Line",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164199.jpg",
                "albumName"         : "잘 가라",
                "artist"            : "시아",
                "release"           : "2018.05.03",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20167234.jpg",
                "albumName"         : "HOW ARE YOU?",
                "artist"            : "엔플라잉(N.Flying)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165917.jpg",
                "albumName"         : "밤",
                "artist"            : "케이션(KSHEON)",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166648.jpg",
                "albumName"         : "앞으로의 시간들",
                "artist"            : "박현구",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167240.jpg",
                "albumName"         : "Old Singer Mr. Jo",
                "artist"            : "김창남",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20167358.jpg",
                "albumName"         : "Blanc_Rainy",
                "artist"            : "Newzz",
                "release"           : "2018.05.18",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164934.jpg",
                "albumName"         : "후니용이 발라드",
                "artist"            : "후니용이",
                "release"           : "2018.05.09",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166596.jpg",
                "albumName"         : "기름진 멜로 (SBS 월화드라마)",
                "artist"            : "영재 (GOT7)",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165881.jpg",
                "albumName"         : "탈출",
                "artist"            : "휴고(Hughgo)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20165055.jpg",
                "albumName"         : "One Day",
                "artist"            : "YELLOW COFFEE(옐로우 커피)",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166802.jpg",
                "albumName"         : "Time For Me",
                "artist"            : "TA TA TO",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166903.jpg",
                "albumName"         : "70-80 가요사랑 3",
                "artist"            : "완흥",
                "release"           : "2018.05.16",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20164305.jpg",
                "albumName"         : "위대한 유혹자 OST",
                "artist"            : "NA",
                "release"           : "2018.05.02",
                "price"             : "15000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20164362.jpg",
                "albumName"         : "Climber",
                "artist"            : "EQual",
                "release"           : "2018.05.09",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166428.jpg",
                "albumName"         : "오늘 뭐해 (What R U Up To?)",
                "artist"            : "박봄슬",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20163477.jpg",
                "albumName"         : "시를 잊은 그대에게(tvN 월화드라마)",
                "artist"            : "공기남녀",
                "release"           : "2018.04.30",
                "price"             : "13000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166009.jpg",
                "albumName"         : "Nobody Knows",
                "artist"            : "멜로베이스",
                "release"           : "2018.05.11",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20165595.jpg",
                "albumName"         : "알 수가 없네",
                "artist"            : "창출",
                "release"           : "2018.05.10",
                "price"             : "13000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20166344.jpg",
                "albumName"         : "Re:Make 1",
                "artist"            : "EOS",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20164791.jpg",
                "albumName"         : "어두운 밤이오면",
                "artist"            : "까망베르치즈(camembert)",
                "release"           : "2018.05.08",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20167314.jpg",
                "albumName"         : "The Cafe Latte",
                "artist"            : "Sweet Jazz",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20162078.jpg",
                "albumName"         : "바보야",
                "artist"            : "이지영(Lee Ji Young)",
                "release"           : "2018.04.30",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20165814.jpg",
                "albumName"         : "Young Cows Kill Them All",
                "artist"            : "Y.C.K.T.A",
                "release"           : "2018.05.11",
                "price"             : "13000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20165494.jpg",
                "albumName"         : "baby dream night",
                "artist"            : "girlsonmood(걸스온무드)",
                "release"           : "2018.05.10",
                "price"             : "11000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "729294.jpg",
                "albumName"         : "탈피",
                "artist"            : "사운드마켓(Sound Market)",
                "release"           : "2018.04.06",
                "price"             : "13000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166615.jpg",
                "albumName"         : "Almond Tree",
                "artist"            : "브레이브소어(Brave sower)",
                "release"           : "2018.05.15",
                "price"             : "20000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166535.jpg",
                "albumName"         : "Chill Day",
                "artist"            : "포디(For D)",
                "release"           : "2018.05.17",
                "price"             : "11000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166573.jpg",
                "albumName"         : "두 가지 이야기",
                "artist"            : "양날(Yang-Nal)",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20166416.jpg",
                "albumName"         : "Odyssey",
                "artist"            : "맨해튼 반지하",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20161918.jpg",
                "albumName"         : "Demons",
                "artist"            : "Sameday Records",
                "release"           : "2018.04.25",
                "price"             : "13000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166670.jpg",
                "albumName"         : "널 정말 사랑하니까",
                "artist"            : "마카롱클라우드",
                "release"           : "2018.05.15",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20165872.jpg",
                "albumName"         : "Lunar Phases",
                "artist"            : "LVGOON",
                "release"           : "2018.05.11",
                "price"             : "15000원"
            },
            {
                "category"          : "랩힙합",
                "albumJaketImage"   : "20167188.jpg",
                "albumName"         : "Favor",
                "artist"            : "L.IE (엘라이)",
                "release"           : "2018.05.17",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "20159749.jpg",
                "albumName"         : "I’m Island",
                "artist"            : "전찬준",
                "release"           : "2018.04.13",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162174.jpg",
                "albumName"         : "엔조이 (feat. 아이엠)",
                "artist"            : "트루맨",
                "release"           : "2018.04.24",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164957.jpg",
                "albumName"         : "오늘이 지나면",
                "artist"            : "노래하는 코트",
                "release"           : "2018.05.08",
                "price"             : "10000원"
            },
            {
                "category"          : "락메탈",
                "albumJaketImage"   : "735412.jpg",
                "albumName"         : "2018 YB Live in Pyongyang",
                "artist"            : "YB",
                "release"           : "2018.04.24",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20164031.jpg",
                "albumName"         : "Signature",
                "artist"            : "Avantgar",
                "release"           : "2018.05.10",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20163927.jpg",
                "albumName"         : "SMILE",
                "artist"            : "천둥",
                "release"           : "2018.05.01",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166859.jpg",
                "albumName"         : "언제부터",
                "artist"            : "브란(BRAN)",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166054.jpg",
                "albumName"         : "Voyage (항해)",
                "artist"            : "NGB",
                "release"           : "2018.05.14",
                "price"             : "10000원"
            },
            {
                "category"          : "팝",
                "albumJaketImage"   : "20162166.jpg",
                "albumName"         : "Say Something",
                "artist"            : "제이플라(J.Fla)",
                "release"           : "2018.04.26",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166568.jpg",
                "albumName"         : "5월16일",
                "artist"            : "송하철",
                "release"           : "2018.05.16",
                "price"             : "10000원"
            },
            {
                "category"          : "발라드",
                "albumJaketImage"   : "20166264.jpg",
                "albumName"         : "If I Have One Day",
                "artist"            : "이은율",
                "release"           : "2018.05.14",
                "price"             : "20000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166687.jpg",
                "albumName"         : "Beauty At The Beach",
                "artist"            : "투톤(Two Tone)",
                "release"           : "2018.05.15",
                "price"             : "11000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20161493.jpg",
                "albumName"         : "알지도 못하면서",
                "artist"            : "민서",
                "release"           : "2018.04.19",
                "price"             : "11000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "742334.jpg",
                "albumName"         : "Luv Highway",
                "artist"            : "아이디(Eyedi)",
                "release"           : "2018.05.16",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20162734.jpg",
                "albumName"         : "You Are In My Mine",
                "artist"            : "지니(Jini)",
                "release"           : "2018.04.26",
                "price"             : "15000원"
            },
            {
                "category"          : "재즈",
                "albumJaketImage"   : "20166273.jpg",
                "albumName"         : "Love 15",
                "artist"            : "김민규",
                "release"           : "2018.05.12",
                "price"             : "10000원"
            },
            {
                "category"          : "포크어코스틱",
                "albumJaketImage"   : "20167210.jpg",
                "albumName"         : "거 봐",
                "artist"            : "무드온(Mood On)",
                "release"           : "2018.05.17",
                "price"             : "20000원"
            },
            {
                "category"          : "댄스",
                "albumJaketImage"   : "20164658.jpg",
                "albumName"         : "브레이커스 Part.3",
                "artist"            : "후이",
                "release"           : "2018.05.05",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20166050.jpg",
                "albumName"         : "사랑이란",
                "artist"            : "한다정",
                "release"           : "2018.05.14",
                "price"             : "13000원"
            },
            {
                "category"          : "트로트",
                "albumJaketImage"   : "20164479.jpg",
                "albumName"         : "What's Going On?",
                "artist"            : "소명 [성인가요]",
                "release"           : "2018.05.10",
                "price"             : "10000원"
            },
            {
                "category"          : "R&B",
                "albumJaketImage"   : "20166968.jpg",
                "albumName"         : "GRADATION Vol.2",
                "artist"            : "ELO",
                "release"           : "2018.05.15",
                "price"             : "13000원"
            }
    ]};
    	this.musicList = musicList.data;
    	for (const key in this.musicList) {
    		this.musicList[key].idx = key;
    	}
	}

	initCart () {
		const cartStorage = localStorage.getItem('cart');
		this.cart = cartStorage ? JSON.parse(cartStorage) : {};
	}

	setCart () {
		localStorage.setItem('cart', JSON.stringify(this.cart));
	}

	clearCart () {
		localStorage.removeItem('cart');
	}
}

const numberFormat = number => new Intl.NumberFormat().format(number);

const model = new Model();
const render = new Render(model);

$(document)
.on("click", "a[href='#']", e => e.preventDefault())
.on("click", "#main-menu > li", render.categorySelect())
.on("click", "#main-menu .search button", render.search())