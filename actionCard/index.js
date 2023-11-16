import React from 'react'
import Icon from 'components/icon'
import Button from 'components/button'
import * as Styled from './style'

const ActionCard = ({ title, description, iconName, iconSize, action, actionCallback }) => (
  <Styled.Wrapper data-testid="action-card">
    {iconName && <Icon name={iconName} size={iconSize} />}
    <Styled.Title>{title}</Styled.Title>
    <Styled.Description>{description}</Styled.Description>
    <Button text={action} onClickCallback={actionCallback} />
  </Styled.Wrapper>
)

export default ActionCard
ActionCard.defaultProps = {
  title: '',
  description: '',
  iconName: '',
  iconSize: 'large',
  action: '',
  actionCallback: null
}
