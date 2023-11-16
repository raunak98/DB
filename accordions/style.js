import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ hasPagination }) => css`
    ${hasPagination
      ? css`
          > div > div > table > tbody > tr {
            // removing the padding from the main table only (which is wrapping the accordions)
            // without removing it from any other child table
            > td {
              padding: 0;
            }

            // removing the border bottom from all accordion wrappers, execpt the last one,
            // to avoid having two borders of adjacent accordions
            :not(:last-child) {
              > td > div {
                border-bottom: none;
              }
            }
          }
        `
      : css`
          div > div > table > tbody > tr {
            // removing the padding from the main table only (which is wrapping the accordions)
            // without removing it from any other child table
            > td {
              padding: 0;
            }

            // removing the border bottom from all accordion wrappers, execpt the last one,
            // to avoid having two borders of adjacent accordions
            :not(:last-child) {
              > td > div {
                border-bottom: none;
              }
            }
          }
        `}
  `}
`
