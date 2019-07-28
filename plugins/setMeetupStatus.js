export default (meetup) => {
  let chipData = {}

  const nowWithoutTime = new Date()
  nowWithoutTime.setHours('00')
  nowWithoutTime.setMinutes('00')
  nowWithoutTime.setSeconds('00')
  nowWithoutTime.setMilliseconds('00')

  const nowPlusOneDay = new Date(nowWithoutTime)
  nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1)

  const meetupDateWithoutTime = new Date(meetup.date)
  meetupDateWithoutTime.setHours('00')
  meetupDateWithoutTime.setMinutes('00')
  meetupDateWithoutTime.setSeconds('00')
  meetupDateWithoutTime.setMilliseconds('00')

  const now = new Date()
  const meetupDate = new Date(meetup.date)      
  // Set time on meetupDate
  if (meetup.time == null) {
    meetup.time = '00:00'
  }
  const hours_minutes = meetup.time.split(':')
  meetupDate.setHours(hours_minutes[0])
  meetupDate.setMinutes(hours_minutes[1])


  if (meetupDate < now) {
    return chipData = {
      id: meetup.id,
      color: 'error',
      text: 'Closed'
    }
    } else if (meetupDateWithoutTime.getTime() == nowWithoutTime.getTime() || meetupDateWithoutTime.getTime() == nowPlusOneDay.getTime()) {
      return chipData = {
        id: meetup.id,
        color: 'amber',
        text: 'Hurry!',
      }
    } else {
      return chipData = {
        id: meetup.id,
        color: 'success',
        text: 'Open',
      }
    }
}