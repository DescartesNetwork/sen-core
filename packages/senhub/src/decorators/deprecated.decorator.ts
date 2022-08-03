export const declareDeprecated = ({
  memberName,
  deadline,
}: {
  memberName: string
  deadline: string
}) => {
  console.warn(
    `${memberName} is deprecated and no longer available in ${deadline}. Please use new hooks for getting rid of dependent providers, and better performance!`,
  )
}
