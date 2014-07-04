<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

	<title>جمانه</title>

	<link rel="stylesheet" type="text/css" href="../styles/css/main.css">
<!--

	<script src="../scripts/vendor/foxie.js"></script>

	<script src="../scripts/require.js"></script>

	<script>
		require.config({

			baseUrl: '../scripts/js/lib'

		});

		require(['../scripts/js/pages/demo.js']);
	</script>

 -->

</head>

<?php

	function zerofill($number) {

		$result = '';

		$string = $number + '';

		for ($i = 1; $i < 3 - strlen($string); $i++)

			$result += '0';

		$result += $string;

		return $result;

	}

?>

<body>

	<?php

		require_once 'core/BrowserDetection.php';

		$browser = new BrowserDetection();
		// echo 'You are using ', $browser->getBrowser(), ' version ', $browser->getVersion();

		if (($browser->getBrowser() == 'Internet Explorer') && ($browser->getVersion <= 8)) {

			echo 'Bitch';

		}

		else {

			echo 'OK!';

		}


	?>

	<div class="sky">

	<div class="clouds">

		<div class="cloud-back"></div>

		<div class="cloud"></div>

	</div>


	<ul class="main-menu">

		<li class="menu-item contactus"></li>

		<li class="menu-item news"></li>

		<li class="menu-item products"></li>

	</ul>

<!--
	<div class="white-box">

		<form class="login-box" method="post" action="">

			<input type="text" placeholder="نام کاربری">

			<input type="password" placeholder="رمز عبور">

			<input type="submit" class="btn" value="ورود">

		</form>

		<?php // include 'home-menu.php'; ?>

	</div> -->

	<?php include 'product-panel.php'; ?>

	<div class="products-box">

		<div class="products-box-content">

			<?php

				// This array will replace with a sql query :)
				$names = array(

					array('کلوچه‌ی پرتقالی', 'kolooche', 'gandom', 'porteghal'),
					array('کلوچه‌ی چتری با مغز کاکائو', 'kolooche', 'gandom', 'cacaoo'),
					array('کلوچه‌ی گردویی', 'kolooche', 'gandom', 'gerdoo'),
					array('کلوچه‌ی مخصوص گردویی', 'kolooche', 'gandom', 'gerdoo'),
					array('کلوچه‌ی مخصوص گردویی', 'kolooche', 'gandom', 'gerdoo'),
					array('کلوچه‌ی خرمایی', 'kolooche', 'gandom', 'khorma'),
					array('کوکی فندقی', 'kooki', 'gandom', 'fandogh'),
					array('بیسکویت دایجستیو', 'bisquit', 'saboos', ''),
					array('', 1),
					array('', 1)

				);

				// echo json_encode($names);

				$path = '../files/images/products';

				$count = 1;

				$filename = array();

				if ($handle = opendir($path))

					/* This is the correct way to loop over the directory. */
				    while (false !== ($entry = readdir($handle)))

				        if (($entry != '.') && ($entry != '..')) {

			        		$filename[$count] = $path . "/" . $entry;

					    	$count++;

					    }

				for ($i = 1; $i < $count; $i++){

					echo "<div class=\"product-item\" data-page=\"" . $i . "\" data-type=\"" . $names[$i - 1][1] . "\" data-base=\"" . $names[$i - 1][2] . "\" data-flav=\"" . $names[$i - 1][3] . "\">";

					echo "<img class=\"product-icon\" src=\"" . $filename[$i] . "\" alt=\"" . $i . "\">";

					echo "<h3 class=\"product-icon-title\">" . $names[$i - 1][0] . "</h3>";

					echo "</div>";

				}

			    closedir($handle);

			?>


		</div>

		<div class="close"></div>

	</div>

	<div class="aboutus-box">

		<p class="aboutus-box-content">

			صنایع غذایی انصاری در سال 1350 به شکل سنتی فعالیت خود را آغاز و اقدام به تولید نان جو و کلوچه سنتی از آرد گندم و جو نمود. <br />
			در سال 1375 با توجه به استقبال مصرف کنندگان محصولات خود را به صورت صنعتی و انبوه تولید و به بازار ارائه کرد. <br />
			این مجموعه با احداث واحد شماره 2 ، واقع در شهرک صنعتی بهارستان کرج، موفق به دریافت نشان استانداردبه عنوان اولین تولید کننده بیسکوئیت جو، با شهد توت در ایران گردید، آنچه در خصوص محصولات تولیدی جمانه حائز اهمیت است، استفاده از مواد اولیه‌ی ارگانیک نظیر شهد توت، شهد خرما، جوانه گندم، هل، دارچین، مغز تخمه آفتابگردان، زیره، شوید، کنجد و ... می باشد. <br />
			اینک پس از اخذ استانداردهای بین المللی و همچنین گسترش توزیع در سطح کشور، با حفظ کیفیت و حقوق شهروندی در نظر داریم تا با گسترش صادرات محصولات خود، گامی مهم در عرصه رقابت برداریم.

		</p>

		<div class="close"></div>

	</div>

	<div class="contactus-box">

		<p class="contactus-box-content">

			صنایع غذایی انصاری در سال 1350 به شکل سنتی فعالیت خود را آغاز و اقدام به تولید نان جو و کلوچه سنتی از آرد گندم و جو نمود. <br />
			در سال 1375 با توجه به استقبال مصرف کنندگان محصولات خود را به صورت صنعتی و انبوه تولید و به بازار ارائه کرد. <br />
			این مجموعه با احداث واحد شماره 2 ، واقع در شهرک صنعتی بهارستان کرج، موفق به دریافت نشان استانداردبه عنوان اولین تولید کننده بیسکوئیت جو، با شهد توت در ایران گردید، آنچه در خصوص محصولات تولیدی جمانه حائز اهمیت است، استفاده از مواد اولیه‌ی ارگانیک نظیر شهد توت، شهد خرما، جوانه گندم، هل، دارچین، مغز تخمه آفتابگردان، زیره، شوید، کنجد و ... می باشد. <br />
			اینک پس از اخذ استانداردهای بین المللی و همچنین گسترش توزیع در سطح کشور، با حفظ کیفیت و حقوق شهروندی در نظر داریم تا با گسترش صادرات محصولات خود، گامی مهم در عرصه رقابت برداریم.

		</p>

		<div class="close"></div>

	</div>


	<div class="news-box">

		<div class="news-box-content">

			<div class="news-item">

				<div class="news-date">پنج شنبه 5 تیر 1393</div>

				<div class="news-title">در مراسم افتتاحیه گوگل I/O چه گذشت؟</div>

				<div class="news-body">افتتاحیه کنفرانس امسال گوگل I/O کوله‌باری از انواع خبرها را با خود همراه داشت؛ تعدادی قابل پیشبینی و تعدادی نیز به غایت غیرقابل پیشبینی!</div>

			</div>

			<div class="news-item">

				<div class="news-date">چهار شنبه 4 تیر 1393</div>

				<div class="news-title">تویوتا با سدان تمام هیدروژنی خود به جنگ تسلا S آمد!</div>

				<div class="news-body">تویوتا شاید صاحب یکی از برترین خودروهای هیبریدی دنیا Prius باشد، اما این شرکت همچنان از ورود به تولید خودروهای تمام الکتریکی اجتناب می‌کند و در عوض بر روی سوخت هیدروژنی به عنوان سوخت خودروهای آینده حساب باز کرده است.</div>

			</div>

			<div class="news-item">

				<div class="news-date">چهار شنبه 3 تیر 1393</div>

				<div class="news-title">سه خبر از آیفون 6</div>

				<div class="news-body">تعدادی از کاربران، اندروید را به این دلیل انتخاب نکرده‌اند که از iOS بدشان می‌آید، بلکه آن‌ها آیفون را بسیار کوچک می‌دانند و گوشی‌های بزرگ اندرویدی این خواسته آن‌ها را با انواع و اقسام نمونه برآورده می‌کنند. کافی است آیفون کنونی را با یک فبلت به عنوان مثال گلکسی نوت مقایسه کنید تا متوجه منظور ما شوید.</div>

			</div>

			<div class="news-item">

				<div class="news-date">چهار شنبه 3 تیر 1393</div>

				<div class="news-title">در مراسم افتتاحیه گوگل I/O چه گذشت؟</div>

				<div class="news-body">افتتاحیه کنفرانس امسال گوگل I/O کوله‌باری از انواع خبرها را با خود همراه داشت؛ تعدادی قابل پیشبینی و تعدادی نیز به غایت غیرقابل پیشبینی!</div>

			</div>

			<div class="news-item">

				<div class="news-date">چهار شنبه 3 تیر 1393</div>

				<div class="news-title">تویوتا با سدان تمام هیدروژنی خود به جنگ تسلا S آمد!</div>

				<div class="news-body">تویوتا شاید صاحب یکی از برترین خودروهای هیبریدی دنیا Prius باشد، اما این شرکت همچنان از ورود به تولید خودروهای تمام الکتریکی اجتناب می‌کند و در عوض بر روی سوخت هیدروژنی به عنوان سوخت خودروهای آینده حساب باز کرده است.</div>

			</div>


		</div>

		<div class="close"></div>

	</div>


	<div class="logo"></div>

	<!-- <div class="login-btn"></div> -->

	<!-- <div class="enter-notice"></div> -->



	<!-- <div class="pane">

		<label for="text-i">i: </label>

		<input class="textbox" id="text-i" type="text" value="0">

		<label for="text-j">j: </label>

		<input class="textbox" id="text-j" type="text" value="0">

	</div> -->

	<script src="../scripts/vendor/jquery-1.9.1.min.js"></script>

	<script src="../scripts/js/lib/index.js"></script>

	<script src="../scripts/js/lib/repeat.js"></script>

	<script src="../scripts/js/lib/contactus.js"></script>

	<script src="../scripts/js/lib/news.js"></script>

	<script src="../scripts/js/lib/mjRadios.js"></script>

	<script src="../scripts/js/lib/products.js"></script>

</body>



</html>