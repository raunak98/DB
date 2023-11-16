import React from 'react'
import Table from 'components/table'
import * as Styled from './style'

const Accordions = ({ children, hasPagination }) => {
  const allColumns = [
    {
      id: 'accordion'
    }
  ]

  const items = children.map((child) => ({
    accordion: child
  }))

  return (
    <Styled.Wrapper hasPagination={hasPagination}>
      <Table
        allColumns={allColumns}
        hasBorder={false}
        hasHeader={false}
        hasPagination={hasPagination}
        items={items}
      />
    </Styled.Wrapper>
  )
}

export default Accordions
Accordions.defaultProps = {
  children: [],
  hasPagination: true
}
