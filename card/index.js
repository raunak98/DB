import React from 'react'
import Icon from 'components/icon'
import * as Styled from './style'

const Card = ({ title, description, iconName, image, textOnly }) => {
  return (
    <Styled.Wrapper textOnly={textOnly} data-testid="card">
      {iconName && <Icon name={iconName} size="large" />}
      <Styled.TitleWrapper>
        <Styled.Title>{title}</Styled.Title>

        {!!textOnly && <Icon name="chevronRight" size="tiny" />}
      </Styled.TitleWrapper>
      {image && <Styled.Image src={image} alt={title} />}
      <Styled.Description>{description}</Styled.Description>
    </Styled.Wrapper>
  )
}

Card.defaultProps = {
  title: '',
  description: '',
  iconName: '',
  textOnly: false
}

export default Card
