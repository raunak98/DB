import styled, { css } from 'styled-components'

export const Grid = styled.div`
  ${({ theme: { mixins, grid } }) => css`
    display: grid;
    grid-template-rows: auto [last-line];
    margin: 0 auto;
    grid-row-gap: 0;

    width: ${grid.xxlarge.width};
    grid-template-columns: repeat(12, [col-start] ${grid.xxlarge.columnWidth});
    grid-column-gap: ${grid.xxlarge.columnGap};

    ${mixins.media.xlarge(css`
      width: ${grid.xlarge.width};
      grid-template-columns: repeat(12, [col-start] ${grid.xlarge.columnWidth});
      grid-column-gap: ${grid.xlarge.columnGap};
    `)}

    ${mixins.media.large(css`
      width: ${grid.large.width};
      grid-template-columns: repeat(12, [col-start] ${grid.large.columnWidth});
      grid-column-gap: ${grid.large.columnGap};
    `)}

    ${mixins.media.medium(css`
      width: ${grid.medium.width};
      grid-template-columns: repeat(12, [col-start] ${grid.medium.columnWidth});
      grid-column-gap: ${grid.medium.columnGap};
    `)}
  `}
`
