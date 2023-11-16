import React, { useState, useEffect } from 'react'
import { useUID } from 'helpers/hooks'
import Calendar from 'react-calendar'
import Icon from 'components/icon'
import TextInput from 'components/textInput'
import * as Styled from './style'

const DatePicker = ({ label, initialDate, onChangeCallback }) => {
  const id = useUID('datepicker-')
  const [date, setDate] = useState(initialDate)
  const [showCalendar, setShowCalendar] = useState(false)

  function onClickAway(event) {
    const wrapper = document.querySelector(`#${id}`)
    const isWithinDatePicker = wrapper?.contains(event.target)
    let isMonthSelection = event.target.parentElement
    isMonthSelection = isMonthSelection?.classList.contains(
      'react-calendar__year-view__months__month'
    )

    if (!isWithinDatePicker && !isMonthSelection) {
      setShowCalendar(false)
    }
  }

  useEffect(() => {
    if (showCalendar) {
      document.addEventListener('click', (event) => onClickAway(event))
    } else {
      document.removeEventListener('click', (event) => onClickAway(event))
    }
    return () => document.removeEventListener('click', (event) => onClickAway(event))
  }, [showCalendar])

  const onSelectDate = (selectedDate) => {
    setDate(selectedDate)
    setShowCalendar(false)

    if (onChangeCallback instanceof Function) {
      onChangeCallback(selectedDate.toLocaleDateString())
    }
  }

  return (
    <Styled.Wrapper id={id}>
      <Styled.Icon>
        <Icon name="date" size="small" />
      </Styled.Icon>
      <TextInput
        label={label}
        initialValue={date ? date.toLocaleDateString() : ''}
        readOnly
        onFocusCallback={() => setShowCalendar(true)}
      />
      {showCalendar && (
        <Calendar
          onChange={onSelectDate}
          value={date}
          minDetail="year"
          prevLabel={<Icon name="chevronLeft" size="tiny" />}
          nextLabel={<Icon name="chevronRight" size="tiny" />}
          prev2Label={null}
          next2Label={null}
        />
      )}
    </Styled.Wrapper>
  )
}

export default DatePicker
DatePicker.defaultProps = {
  label: '',
  initialDate: undefined,
  onChangeCallback: undefined
}
