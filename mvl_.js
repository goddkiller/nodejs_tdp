	function update() {
		 var mvl = document.createElement('script');
	    mvl.type = 'text/javascript'; mvl.async = true;
	    mvl.src = "/account/ajax.php?m=my_trade_info&jsoncallback=bi.update&_=" + (new Date() - 0)
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(mvl, s); 
	};

	var bi = {
		update : function  (json) {
			bi.data = json.extra;// body...
			var price = (json.extra.buy.price - 0 + (json.extra.sell.price - 0))/2
			history.push(price -0);
		},
		buy : function () {
			var price = bi.data.buy.price, amount = bi.data.buy.amount/5;
			$.post("/trade/index.php", {a : "do_buy", price : price, amount : amount});
			console.log("buy " + price + ":" + amount);
		},
		sell : function() {
			var price = bi.data.sell.price, amount = bi.data.sell.amount/2;
			$.post("/trade/index.php", {a : "do_sell", price : price, amount : amount});
			console.log("sell " + price + ":" + amount);
		}
	};

	var analyse = function (decide_interval, pick_interval, range) {//决策周期 /s，采样周期 /s。。。

		setInterval(function () {
			decide(range);
		}, 1000*decide_interval);

		setInterval(function () {
			update(range);
		}, 1000*pick_interval)
	};

	var decide = function (range) {
		var avg, sum = 0; 
		for (var i = 0, l = history.length; i < l; i++) {
			sum += history[i];
		}

		avg = sum / l;

		var buy = bi.buys;
		var sell = bi.sells;



		if (buy()) {
			bi.buy();
		} else if (sell()) {
			bi.sell();
		}
	}


	var history = []; 
	analyse(30, 1, 2);
