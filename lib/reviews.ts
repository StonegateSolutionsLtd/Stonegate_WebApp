/**
 * Every positive Google review about a move or the crew, copied word for word from the Google Business Profile
 * (taken 2026-11-08, newest first). Junk-removal-only reviews and reviews with no text are left out.
 * Shown on /reviews. Add new ones at the top.
 */

/** Three themes that split the reviews between them: every review sits under exactly one */
export type ReviewTopic = 'care' | 'on-time' | 'crew'

export interface GoogleReview {
  name: string
  text: string
  /** The theme the review is mainly about, for the tabs on /reviews */
  topic: ReviewTopic
}

export const REVIEW_TOPICS: { id: ReviewTopic; label: string }[] = [
  { id: 'care', label: 'Careful with belongings' },
  { id: 'on-time', label: 'On time & efficient' },
  { id: 'crew', label: 'Friendly, professional crew' },
]

export const GOOGLE_MOVING_REVIEWS: GoogleReview[] = [
  { name: 'Diana K', topic: 'on-time', text: 'Great service. The guys were super punctual, careful and got things done at a very reasonable time. Would recommend!' },
  { name: 'Chanvi Kotak', topic: 'crew', text: 'Ricardo and Dae’jhun (DJ) were very efficient Extremely quick and super helpful Made our move easy' },
  { name: 'Paige Chandler', topic: 'crew', text: 'Aaryan And Ricardo did an amazing job. Very kind, quick, and helpful. Would use again.' },
  { name: 'Arista Maharjan', topic: 'care', text: 'We had a great experience with this moving company! The team was friendly, professional, and handled our belongings with care. They made the moving process smooth and stress-free. Everything went well, and we really appreciate their help. Highly recommend their service! 😊' },
  { name: 'dolgova daria', topic: 'care', text: 'Really happy with the service. The guys were on time, helpful, and handled everything carefully. The move was quick and easy. Would definitely recommend Stonegate!' },
  { name: 'Michelle Price', topic: 'crew', text: 'Aryan & Ricardo were great - most definitely will recommend - very professional and efficient - really took good care of things while moving me to my new place' },
  { name: 'Sana Hamid', topic: 'on-time', text: 'I had a very good experience with Stonegate Moving. They moved stuff for us from multiple locations on the same day, working 15 hours straight! Very courteous and skilled. Would be happy to use their services again.' },
  { name: 'Tejas Kumar', topic: 'care', text: 'Reliable, efficient & careful. Would highly recommend!' },
  { name: 'M Steel', topic: 'on-time', text: 'Amazing movers. Fast and efficient' },
  { name: 'aneliya', topic: 'crew', text: 'Really happy with the service. The guys were kind, helpful, and made the whole process so much easier. You can tell they genuinely care about their customers. Would definitely recommend!' },
  { name: 'prabhjot bhatia', topic: 'crew', text: 'I had a great experience with my move thanks to Albert and Iaroslav. They were professional, friendly, careful, and worked very efficiently from start to finish. They handled my belongings with care and made the whole moving process much easier and less stressful. I really appreciate their hard work and positive attitude. Highly recommend Albert and Iaroslav to anyone looking for reliable and professional movers! 10/10' },
  { name: 'sylvia Kasepa', topic: 'crew', text: 'Really helped me move a very long distance. Albert and Iaroslav were exceptional in their service.' },
  { name: 'Tabitha Marie Geraghty', topic: 'on-time', text: 'Amazing communication, pleasant and efficient service. These two movers who attended were kind and so helpful 🙏' },
  { name: 'vanessalyt', topic: 'care', text: 'Absolutely phenomenal service! Fair pricing and they helped us with some last minute furniture moving, they handled it with care and I couldn’t be happier with their service! Highly recommend!!!' },
  { name: 'Aria', topic: 'on-time', text: 'Thank you so much for the excellent service, Stonegate team! My friends recommended your company, and I was fully satisfied with the quality of your work. Everything was fast, and your workers were very polite and efficient. Thanks!' },
  { name: 'Nazar Lytvinchuk', topic: 'crew', text: 'Fantastic experience with Stonegate Moving Solutions! They made my recent move completely seamless. Everything was handled professionally and the service was great. Highly recommend!' },
  { name: 'Nabill Abrar Rakib', topic: 'on-time', text: 'made my moving situation easy and reliable. they dont waste time and get right into business. will surely be asking for their help if i have to move again. had to throw away tv and a couch, they took care of that for me too.' },
  { name: 'Cole Dewis', topic: 'on-time', text: 'Had a great experience moving with Stonegate. Everything was efficient and professional at a reasonable price, would definitely book again.' },
  { name: 'Artem Kagramanian', topic: 'on-time', text: 'So easy to deal with. Very punctual and professional company.' },
  { name: 'karmen cas', topic: 'crew', text: 'Excellent service, professional, affordable, and reliable. I highly recommend them. 👍' },
  { name: 'Vlad Ch', topic: 'care', text: 'Absolutely outstanding service! The team was professional, punctual, and incredibly hardworking from start to finish. They handled all of my furniture and belongings with great care, worked efficiently, and made the entire moving process completely stress-free. They were friendly, respectful, and went above and beyond to make sure everything was done perfectly. Nothing was damaged, everything arrived safely, and they finished even faster than I expected. I couldn’t be happier with their service and would highly recommend Stonegate Moving Solutions to anyone looking for reliable, professional movers. Thank you for making my move such a great experience!' },
  { name: 'Алибек Хуров', topic: 'care', text: 'I had a great experience doing business with these guys. From the moment they arrived, they looked professional and clearly knew what they were doing. Everything was done quickly, efficiently, and without any damage to my belongings. At the end, I received a detailed invoice, and I was happy to leave a tip because they truly deserved it. I highly recommend them to anyone looking for a reliable moving company!' },
  { name: 'relup', topic: 'care', text: 'My buddy recommended this company for my moving, i was skeptical at first but still decided to check it out. Even though these guys are relatively new on the market, they made their job for 11/10. Everything was on time, no issues and THE MOST IMPORTANT nothing was broken. Highly recommend Stonegate for your moving. Thanks guys🙏' },
  { name: 'Aryan Kapoor', topic: 'care', text: 'Really happy with the service. The guys were on time, worked quickly, and took good care of my stuff. The whole move went smoothly and they made the process a lot less stressful. Would definitely use them again!' },
  { name: 'Fady Nasr', topic: 'care', text: 'Great experience with Stonegate. The team was professional, efficient, and careful with everything from start to finish. They showed up prepared, handled the move smoothly, and made the whole process much less stressful. Communication was clear, the service felt reliable, and I’d definitely recommend them to anyone looking for movers.' },
  { name: 'Le Cao Huy', topic: 'care', text: 'I had a fantastic experience with Stonegate Moving Solutions. The crew arrived on time, worked efficiently, and treated my furniture and boxes with care. They were friendly, professional, and made the entire moving process much easier than I expected. I would definitely use their services again and highly recommend them to anyone looking for reliable movers.' },
  { name: 'mann patel', topic: 'crew', text: 'I had to move from Vancouver to Salmon Arm on a super short notice for work. Stonegate Moving Solutions team helped move all of my stuff including mattress and tables. I found them to be quite reasonable for long distance moving.' },
  { name: 'Amirali Nasrinpay', topic: 'on-time', text: 'The stonegate solution is the best moving company in the whole of Vancouver. They came on time picked my items and safely put them to the other location i needed them to it. They have one of the strongest times in Vancouver, very respect time and they have a very positive time. Thank you to them again 🙏' },
  { name: 'daniel pereminski', topic: 'on-time', text: 'Great experience with stonegate. Asked them to help me with moving and the team was very professional and efficient, and the price was very competitive! These guys are great!' },
  { name: 'Michael Wang', topic: 'crew', text: 'Very proffesional team, fair pricing. Owe them a beer!' },
  { name: 'Armonia DiVita', topic: 'crew', text: 'Great moving company would recommend 100%' },
]
