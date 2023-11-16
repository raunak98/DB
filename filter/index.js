import React, { useState } from 'react'
import * as Styled from './style'

const Filter = ({ label, filters, initialFilterId, onFilterCallback }) => {
  const [selectedFilterId, setSelectedFilterId] = useState(initialFilterId)

  const onFilter = (event) => {
    const { currentTarget } = event
    setSelectedFilterId(currentTarget.id)
    if (onFilterCallback instanceof Function) {
      onFilterCallback(currentTarget.id)
    }
  }

  return (
    <Styled.Filter data-testid="filter">
      {label && (
        <div>
          <Styled.FilterLabel>{label}</Styled.FilterLabel>
        </div>
      )}
      <div>
        {filters.map((filter) => (
          <Styled.FilterButton
            key={filter.id}
            id={filter.id}
            selected={selectedFilterId === filter.id}
            onClick={onFilter}
          >
            {filter.text}
          </Styled.FilterButton>
        ))}
      </div>
    </Styled.Filter>
  )
}

export default Filter
Filter.defaultProps = {
  label: undefined,
  filters: [],
  initialFilterId: '',
  onFilterCallback: undefined
}
