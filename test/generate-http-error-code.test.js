const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const assert = chai.assert;

const { getTotalWeight, pickWeightedRandomCode, possiblyGenerateErrorCode } = require('../generate-http-error-code');

const evenlyDistributedHttpCodes = {
  '400': {
    weight: 0.5
  },
  '500': {
    weight: 0.5
  }
};

const oddlyDistributedHttpCodes = {
  '400': {
    weight: 1
  },
  '500': {
    weight: 9
  }
};

const urlsGeneratingErrors = [
  {
    url: /something/,
    probability: 0.1,
    codes: evenlyDistributedHttpCodes 
  },
  {
    url: /other/,
    probability: 0.1,
    codes: oddlyDistributedHttpCodes
  },

]


describe('Choose http code', () => {

  describe('Useless initial check', () => {
    it('is `1 + 1 == 2` ?', () => {
      expect(1 + 1 == 2).to.be.true;
    });
  })

  describe('Sinon Math.random() mock should return 0.7', () => {
    before(() => {
      sinon.stub(Math, 'random').returns(0.7);
    });
    after(() => {
      Math.random.restore();
    });
    it('math random', () => {
      const r = Math.random();
      expect(r).to.equal(0.7);
    });
  });

  describe('getTotalWeight', () => {
    it('should return 1 for this', () => {
      const weight = getTotalWeight(evenlyDistributedHttpCodes);
      expect(weight).to.equal(1);
    }),
    it('should return 10 for this one instead', () => {
      const weight = getTotalWeight(oddlyDistributedHttpCodes);
      expect(weight).to.equal(10);
    })
  })

  describe('pickRandomCode', () => {
    describe('test 1', () => {
      before(() => {
        sinon.stub(Math, 'random').returns(0.4);
      });
      after(() => {
        Math.random.restore();
      });
      it('should choose 400', () => {
        const errorCode = pickWeightedRandomCode(evenlyDistributedHttpCodes);
        expect(errorCode).to.equal('400');
      })
    })

    describe('test 2', () => {
      before(() => {
        sinon.stub(Math, 'random').returns(0.6);
      });
      after(() => {
        Math.random.restore();
      });
      it('should choose 500', () => {
        const errorCode = pickWeightedRandomCode(evenlyDistributedHttpCodes);
        expect(errorCode).to.equal('500');
      })
    })

    describe('test 3', () => {
      before(() => {
        sinon.stub(Math, 'random').returns(0.05);
      });
      after(() => {
        Math.random.restore();
      });
      it('should choose 400', () => {
        const errorCode = pickWeightedRandomCode(oddlyDistributedHttpCodes);
        expect(errorCode).to.equal('400');
      })
    })

    describe('test 4', () => {
      before(() => {
        sinon.stub(Math, 'random').returns(0.15);
      });
      after(() => {
        Math.random.restore();
      });
      it('should choose 500', () => {
        const errorCode = pickWeightedRandomCode(oddlyDistributedHttpCodes);
        expect(errorCode).to.equal('500');
      })
    });

    describe('test 5', () => {
      it('should choose 500', () => {
        const errorCode = pickWeightedRandomCode({});
        expect(errorCode).to.equal('500');
      })
    })    
  });

  describe('possiblyGenerateErrorCode', () => {
    describe('generate error 1', () => {
      before(() => {
        const stub = sinon.stub(Math, 'random')
        stub.onCall(0).returns(0.01); // to decide if it's an error
        stub.onCall(1).returns(0.4); // to decide which error -> 400
      });
      after(() => {
        Math.random.restore();
      });

      it('should throw an error with 400', () => {
        assert.throws(
          () => possiblyGenerateErrorCode('/something', urlsGeneratingErrors ), 
          Error, 
          'Generated error 400'
        );
      });
    });

    describe('generate error 2', () => {
      before(() => {
        const stub = sinon.stub(Math, 'random')
        stub.onCall(0).returns(0.01); // to decide if it's an error
        stub.onCall(1).returns(0.6); // to decide which error -> 500
      });
      after(() => {
        Math.random.restore();
      });

      it('should throw an error with 500', () => {
        assert.throws(
          () => possiblyGenerateErrorCode('/something', urlsGeneratingErrors ), 
          Error, 
          'Generated error 500'
        );
      });
    });

    describe('generate error 3', () => {
      before(() => {
        const stub = sinon.stub(Math, 'random')
        stub.onCall(0).returns(0.2); // to decide if it's an error
      });
      after(() => {
        Math.random.restore();
      });

      it('should not throw an error', () => {
        assert.doesNotThrow(
          () => possiblyGenerateErrorCode('/something', urlsGeneratingErrors )
        );
      });
    });    
  });
})
