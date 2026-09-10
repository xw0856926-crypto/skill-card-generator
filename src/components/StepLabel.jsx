function StepLabel({ number, title }) {
  return (
    <div className="step-label">
      <span className="step-label__number">{number}</span>
      <h2 className="step-label__title">{title}</h2>
    </div>
  )
}

export default StepLabel
