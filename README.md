# Paypal Test Integration

To run locally please run `npm install` to load all dependencies.

Then, run `npm run start-dev` to run development server that uses nodemon and ts-node to compile and run the Typescript code.

To compile for production, simply run `npm start`

## Exposed endpoints:

This implementation of the Paypal Node SDK using Express expose a number of endpoints to properly interact with the web service:

`paypal/billing-agreement` 

    - Method: POST
    - Args:
        Billing Agreement -> JSON object defining the Billing Agreement
        Billing Plan -> JSON object defining the specific payments and
        other specification of the agreement
    - Creates a new billing agreement plan.

`paypal/billing-agreement/execute`
    
    - Method: GET
    - Args: 
        Token -> Payment Token given by PayPal
    - Executes a created billing agreement

`paypal/billing-agreement/list`

    - Method: GET
    - Retrieves a list of all active billing agreements in
    a specific vendor account

`paypal/billing-agreement/cancel`

    - Method: POST
    - Args:
        billingAgreementId -> Unique identification of the Billing Agreement
        cancel_note -> A note written by the user
    - Cancels an existent billing agreement

`paypal/billing-agreement/suspend`

    - Method: POST
    - Args
        billingAgreementId -> Unique identification of the Billing Agreement
        suspend_note -> A note written by the user
    - Suspend an existent billing agreement until reactivated

`paypal/billing-agreement/reactivate`

    - Method: POST
    - Args:
        billingAgreementId -> Unique identification of the Billing Agreement
        reactivate_note -> A note written by the user
    - Reactivates a suspended billing agreement

Additionaly and for testing purposes, I've included two endpoints for creating and
executing simple paypal payments

`/paypal`

    - Method: POST
    - Creates a new paypal payment

`/paypal/execute`

    - Method: GET
    - Args:
        payment_id -> Unique identification of the payment created by PayPal
        payer_id -> Unique identification of the user creating the payment
    - Executes the payment

## Webhooks

These are all the webhooks currently supported by this implementation of Paypal's API:

- BILLING.PLAN.CREATED
- BILLING.PLAN.UPDATED
- BILLING.SUBSCRIPTION.CREATED
- BILLING.SUBSCRIPTION.CANCELLED
- BILLING.SUBSCRIPTION.RE-ACTIVATED
- BILLING.SUBSCRIPTION.SUSPENDED
- BILLING.SUBSCRIPTION.UPDATED

## More Information

For more information regarding the structure of the Billing Agreements, please refer to the `samples` folder in `routes/samples`

- [Paypal Node SDK samples](https://github.com/paypal/PayPal-node-SDK/tree/master/samples)
- [Paypal Documentation](https://developer.paypal.com/docs/)
- [Paypal Node Tutorial](https://devblog.paypal.com/building-a-web-app-with-node-js-the-paypal-sdk/)
