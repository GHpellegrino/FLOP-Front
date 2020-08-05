var stripe = Stripe('pk_test_51H5vUCI9EA8SBQRgThOtrGfaKjWFt2FQLzfoo8JFEaHRc74T9qqhxNd2fOSWl7zQNGJBC75siG2Bfdo5e4jmY6z200anlvcrjG');
var elements = stripe.elements();

var style = {
  base: {
    iconColor: '#666EE8',
    color: '#31325F',
    lineHeight: '40px',
    fontWeight: 300,
    fontFamily: 'Helvetica Neue',
    fontSize: '15px',

    '::placeholder': {
      color: '#CFD7E0',
    },
  },
};

var cardNumberElement = elements.create('cardNumber', {
  style: style
});
cardNumberElement.mount('#card-number-element');

var cardExpiryElement = elements.create('cardExpiry', {
  style: style
});
cardExpiryElement.mount('#card-expiry-element');

var cardCvcElement = elements.create('cardCvc', {
  style: style
});
cardCvcElement.mount('#card-cvc-element');


function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {
    // In this example, we're simply displaying the token
    successElement.querySelector('.token').textContent = result.token.id;
    successElement.classList.add('visible');

    // In a real integration, you'd submit the form with the token to your backend server
    var form = document.querySelector('form');
    form.querySelector('input[name="token"]').setAttribute('value', result.token.id);
    form.submit();
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

var cardBrandToPfClass = {
	'visa': 'pf-visa',
  'mastercard': 'pf-mastercard',
  'amex': 'pf-american-express',
  'discover': 'pf-discover',
  'diners': 'pf-diners',
  'jcb': 'pf-jcb',
  'unknown': 'pf-credit-card',
}

function setBrandIcon(brand) {
	var brandIconElement = document.getElementById('brand-icon');
  var pfClass = 'pf-credit-card';
  if (brand in cardBrandToPfClass) {
  	pfClass = cardBrandToPfClass[brand];
  }
  for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
  	brandIconElement.classList.remove(brandIconElement.classList[i]);
  }
  brandIconElement.classList.add('pf');
  brandIconElement.classList.add(pfClass);
}

cardNumberElement.on('change', function(event) {
	// Switch brand logo
	if (event.brand) {
  	setBrandIcon(event.brand);
  }

	setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var options = {
    challenge: document.getElementById('challenge').value,
    deadline: document.getElementById('deadline').value,
    montant: document.getElementById('montant').value,
    email: document.getElementById('email').value,
    approbateur_email: document.getElementById('approbateur_email').value,
  };
  stripe.createToken(cardNumberElement, options).then(setOutcome);
});
