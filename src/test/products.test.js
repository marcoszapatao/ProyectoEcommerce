import { expect } from 'chai';
import supertest from 'supertest'

//const expect = chai.expect
const requester = supertest('http://localhost:8080/');

describe('Testing Ecommerce', () => {
    describe('Test de productos', () => {
        it('El endpoint POST /api/products debera registrar un producto', async() => {
            const productsMock = {
                title: 'Zapatilla Nike',
                description: 'Air Force',
                code: '348964',
                price: '898000',
                stock: '23',
                category: 'Shoes',
                thumbnails: 'No hay'
            }

            const response = await requester.post('/products').send(productsMock)
            const { status, ok, _body} = response
            console.log('Aquiiiiiiiiiiiiiiiiiiiiiiiiiiii')
            console.log(_body)
            expect(_body.payload).to.not.be.null;
            expect(_body.payload).to.not.be.undefined;
            expect(_body.payload).to.have.property('_id');
        })
        it('En endpoint /api/products no deberia crear un producto con datos vacios', async() => {
            const productsMock = {}
            const response = await requester.post('/products').send(productsMock)
            const { status, ok, _body } = response

            expect(ok).to.be.eq(false)
        })
    })
})