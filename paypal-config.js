module.exports = function (PaypalSDK) {
    console.log("Configurating PaypalSDK")
    PaypalSDK.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'Af06llQQrJ0OAvPXu2JogElHIWcYxMSqIPLHE9ZvDxgOi-rN6NsHVUXmf0pK5W5C1mgBAU8IvzQ3se8i',
        'client_secret': 'EHPCjLD3GO6w7O0VwlDLk4z1YrCrDzZr23cQ3EcR2O2wW-NMyT91o9fL4sW8p-ljHParrzEBE1L1VL_j',
        'headers': {
            'custom': 'header'
        },
        'openid_redirect_uri': 'http://localhost/paypal/token'
    })
}