/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../src/app')
const sinon = require('sinon')
const fs = require('fs')

chai.use(chaiHttp)
const { expect } = chai

const mockMissions = JSON.stringify([
  {
    id: 1,
    name: 'Mariner 2',
    year: '1962',
    country: 'Estados Unidos',
    destination: 'Vênus',
  },
  {
    id: 2,
    name: 'Venera 4',
    year: '1967',
    country: 'URSS',
    destination: 'Vênus',
  },
  {
    id: 3,
    name: 'Mariner 5',
    year: '1967',
    country: 'Estados Unidos',
    destination: 'Vênus',
  },
])

describe('Rota de missões', function () {
  describe('GET /missions', function () {
    it('Retorna uma lista de missões', async function () {
      sinon.stub(fs.promises, 'readFile').resolves(mockMissions)
      const response = await chai.request(app).get('/missions')

      expect(response.status).to.be.equal(200)
      expect(response.body).to.haveOwnProperty('missions')
      expect(response.body.missions).to.be.instanceOf(Array)
      expect(response.body.missions).to.have.lengthOf(3)
      sinon.restore()
    })
  })

  describe('POST /missions', function () {
    beforeEach(function () {
      sinon.stub(fs.promises, 'writeFile').resolves()
    })

    afterEach(sinon.restore)

    const mockMission = {
      name: 'Eduardo',
      year: '2022',
      country: 'Brasil',
      destination: 'Marte',
    }
    it('Retorna a missão criada com um id', async function () {
      const response = await chai
        .request(app)
        .post('/missions')
        .send(mockMission)

      expect(response.status).to.be.equal(201)
      expect(response.body).to.haveOwnProperty('mission')
      expect(response.body.mission).to.haveOwnProperty('id')
      expect(response.body.mission.name).to.equal(mockMission.name)
      expect(response.body.mission.year).to.equal(mockMission.year)
      expect(response.body.mission.country).to.equal(mockMission.country)
      expect(response.body.mission.destination).to.equal(
        mockMission.destination,
      )
    })

    it('Escreve a nova missão no arquivo de missões', async function () {
      await chai.request(app).post('/missions').send(mockMission)

      expect(fs.promises.writeFile.called).to.be.equal(true)
    })
  })
})
