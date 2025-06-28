import StepCards from '@components/includes/StepCards/StepCards'

export default function Section() {
  const stepsData = [
    {
      cardTitle: 'ثبت نام',
      cardContent: 'ثبت مشخصات شرکت تأمین کنندگان مالی و درخواست پذیرندگی',
      cardNumber: '1'
    },

    {
      cardTitle: 'انتخاب طرح فروش',
      cardContent: 'ثبت پروتکل‌های تسهیلاتی در پلت‌فرم',
      cardNumber: '2'
    },

    {
      cardTitle: 'ثبت سفارش',
      cardContent: 'پذیرش متقاضایان در پلت‌فرم',
      cardNumber: '3'
    },

    {
      cardTitle: 'دریافت کالا',
      cardContent: 'فرآیندهای پذیرش ، تأیید، تصویب و انعقاد قرارداد با متقاضی',
      cardNumber: '4'
    }
  ]

  return <StepCards title="مراحل ثبت نام تامین کنندگان مالی" stepsData={stepsData} />
}
