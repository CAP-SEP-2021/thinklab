import { reducer, initialState } from './send-order.reducer';

describe('SendOrder Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any; // @mo check later if needed to be changed  

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
