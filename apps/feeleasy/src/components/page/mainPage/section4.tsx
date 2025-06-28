import StepCards from '@components/includes/StepCards/StepCards'

export default function Section() {
  const stepsData = [
    {
      cardTitle: 'ثبت نام',
      cardContent: 'تکمیل اطلاعات هویتی، سکونتی، شغلی، معرف و بررسی رتبه اعتباری‌',
      cardNumber: '1'
    },

    {
      cardTitle: 'انتخاب طرح فروش',
      cardContent:
        'درخواست کالا مورد نظر از فروشگاه و تامین گننده مالی و مراجعه حضوری یا آنلاین به فروشگاه',
      cardNumber: '2'
    },

    {
      cardTitle: 'ثبت سفارش',
      cardContent: 'صدور فاکتور، بارگزاری چک ، امضا قرارداد',
      cardNumber: '3'
    },

    {
      cardTitle: 'دریافت کالا',
      cardContent: 'دریافت حضوری کالا از فروشگاه انتخابی و امضای برگه تحویل کالا',
      cardNumber: '4'
    }
  ]

  return <StepCards title="مراحل خرید اعتباری" stepsData={stepsData} />
}
