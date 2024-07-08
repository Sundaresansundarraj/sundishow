const express = require('express');
const router = express.Router();
const Controller = require("../controllers/payment-controller")
const Validation = require("../validations/validation")

// router.post('/create-payment-intent', paymentController.createPayment);
// router.post('/update-payment-status', paymentController.updatePayment);

router.post('/payment', Validation.paymentValidation, Controller.PaymentController);
router.get('/payment_sucesss', Controller.successPayment);
router.get('/cancel_payment', Controller.cancelPayment);

module.exports = router;
