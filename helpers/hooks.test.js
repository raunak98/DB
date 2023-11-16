import React from 'react'
import { render } from 'test-utils'
import { useUID } from './hooks'

describe('Helpers | Hooks', () => {
  describe('useUID', () => {
    it('should supply a unique string value', () => {
      const Component = () => {
        const id = useUID()
        return <p id={id}>paragraph</p>
      }

      const { container, rerender } = render(
        <>
          <Component />
          <Component />
        </>
      )

      const $p1 = container.querySelectorAll('p')[0]
      expect($p1.id).toEqual('1')

      const $p2 = container.querySelectorAll('p')[1]
      expect($p2.id).toEqual('2')

      rerender(
        <>
          <Component />
          <Component />
        </>
      )

      const $p1after = container.querySelectorAll('p')[0]
      expect($p1after.id, 'UIDs should stay the same after being re-renderd').toEqual('1')

      const $p2after = container.querySelectorAll('p')[1]
      expect($p2after.id, 'UIDs should stay the same after being re-renderd').toEqual('2')
    })

    it('should use optional prefix', () => {
      const Component = () => {
        const id = useUID('some-prefix-')
        return <p id={id}>paragraph</p>
      }
      const { container } = render(<Component />)

      const $p1 = container.querySelector('p')
      expect($p1.id).toMatch(/^some-prefix-/)
    })
  })
})
