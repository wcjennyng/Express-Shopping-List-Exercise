process.env.NODE_ENV = "test"

const { hasUncaughtExceptionCaptureCallback } = require("process")
const request = require("supertest")

const app = require("./app")
let items = require("./fakeDb")

let cereal = { name: "cheerios", price: 3.75 }

beforeEach(function() {
    items.push(cereal)
})

afterEach(function(){
    //should mutate and not redefine 'items', resets 'items'
    items.length = 0
})

//GET list of items
describe("GET /items", function() {
    test("Gets a list of items", async function () {
        const res = await request(app).get(`/items`)
        expect(res.statusCode).toBe(200)

        expect(res.body).toEqual({items: [cereal]})
    })
})

//POST - creates a new item
describe("POST /items", function() {
    test("Creates a new item", async function() {
        const res = await request(app).post(`/items`)
            .send({ name: "milk", price: 2.50 })
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({ item: { name: "milk", price: 2.50 }
        })
    })
})

//GET item by name
describe("GET /items/:name", function() {
    test('Gets an item by name', async function() {
        const res = await request(app).get(`/items/${cereal.name}`)
        expect(res.statusCode).toBe(200)

        expect(res.body).toEqual({item: cereal})
    })
    test("Responds with 404 if can't find item", async function() {
        const res = await request(app).get(`/items/0`)
        expect(res.statusCode).toBe(404)
    })
})

//PATCH - updates item
describe("PATCH /items/:name", function() {
    test("Updates an item", async function() {
        const res = await request(app).patch(`/items/${cereal.name}`)
            .send({ name: "Lucky Charms", price: 3.50 })
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ item: { name: "Lucky Charms", price: 3.50 } })
    })
    test("Responds with 404 if item not found", async function () {
        const res = await request(app).patch(`/items/0`)
        expect(res.statusCode).toBe(404)
    })
})

describe("DELETE /items/:name", function() {
    test("Deletes an item", async function() {
        const res = await request(app).delete(`/items/${cereal.name}`)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: "Deleted"})
    })
})