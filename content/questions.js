/**
 * The questions page, as data.
 *
 * Every question is one a real person types into Google or asks a model:
 * what to wear, how to shop without buying the same thing twice, what a
 * digital wardrobe app is, how to take a mirror selfie that does not look
 * like a mirror selfie. Each answer is useful on its own and says, where it
 * is true, how Fluntr helps. Nothing here claims a feature the app does not
 * have or a number we have not measured: the app is pre-launch, and the page
 * says so.
 *
 * Also emitted as FAQPage JSON-LD and summarised in /llms.txt, so search
 * engines and language models can quote it.
 */

export const TOPICS = [
  {
    id: 'what-to-wear',
    title: 'What to wear',
    blurb: 'The question that started the app.',
    qa: [
      ['What should I wear today?', 'Start from what you own, not from a shop. Pick the one piece you actually feel like wearing, then build around it: one top, one bottom, one layer, shoes. Fluntr does this for you once your closet is photographed: open the app, ask Kween "what should I wear today", and she pulls three outfits from your own clothes, weather and occasion included.'],
      ['I have a full wardrobe and nothing to wear. Why?', 'Because you cannot see it. Most people wear about a fifth of what they own, and the rest is folded under something else. The fix is not more clothes, it is a view of all of them at once. That is exactly what a digital wardrobe app does: every piece in a grid, so the forgotten half comes back into rotation.'],
      ['What to wear to a wedding as a guest in India?', 'Match the event, not the couple. Sangeet and mehendi take colour and movement: a lehenga, a sharara, a bright kurta set, a printed saree. The wedding ceremony takes richer fabric and more cover: silk, brocade, a bandhgala or a sherwani for men. The reception is where you go darker and sleeker. Avoid red at a North Indian wedding and white at most of them unless you have asked. If you have the pieces already, Fluntr can lay the three looks out side by side before you decide.'],
      ['What should I wear on a first date?', 'Something you have worn before and felt good in. A first date is not the day to break in new shoes or a new silhouette. Dress one notch above the venue, keep one thing that is unmistakably you (a colour, a watch, an earring), and make sure you can sit, walk and eat in it. Lay two options out the night before and sleep on it.'],
      ['What do I wear to the office when there is no dress code?', 'Build a uniform. Two or three combinations that always work (a shirt and tailored trousers, a knit and a straight skirt, a kurta and cigarette pants) and rotate them. "No dress code" usually means "do not make us notice", so aim for clean, fitted and unfussy. A closet app helps here because it shows you which of your pieces already combine into those uniforms.'],
      ['What to wear for college every day without repeating?', 'You will repeat, and nobody minds. What reads as "new" is the combination, not the piece. Ten tops and five bottoms are fifty outfits before you add a single layer. Photograph them once and let an outfit planner count the combinations for you; most people are surprised how many they already have.'],
      ['What should I wear in the Indian summer that still looks put together?', 'Cotton, linen and anything loose that moves air: an oversized shirt over a tank, wide trousers, a cotton kurta, a slip dress with flat sandals. Light colours reflect heat and hide sweat worse, so pick mid-tones (sage, sand, dusty blue) over white. Keep one light layer for over-air-conditioned rooms.'],
      ['How do I plan outfits for the whole week?', 'On Sunday, check the week: meetings, dinners, a trip, a wedding. Pick one outfit per day from your closet, photograph or save each one, and hang them in order. Fluntr lets you plan a day in the app from your own closet and look back at what you wore, so the Tuesday panic stops happening.'],
    ],
  },
  {
    id: 'festivals',
    title: 'Festival and occasion dressing',
    blurb: 'Diwali, Navratri, Eid, Onam, Pongal, Christmas, and every sangeet in between.',
    qa: [
      ['What should I wear for Diwali?', 'Diwali is the one night a year to wear the brightest thing you own. For women: a silk or chanderi kurta set, a lehenga in a jewel tone, or a saree with a modern blouse. For men: a kurta in a deep colour with a Nehru jacket, or a bandhgala if the dinner is formal. Gold works with everything. Before you shop, check what is already in your closet from last year; most people own two Diwali outfits they have forgotten.'],
      ['What to wear for Navratri or garba nights?', 'Clothes you can spin in. Chaniya choli with mirror work, a flared skirt with a short kurta, or a kediyu and dhoti for men. Flat shoes or juttis, never heels. Each of the nine nights has a colour, so if you want to follow them, plan all nine in advance rather than at 6 pm each evening. An outfit planner makes the nine-day plan a ten-minute job.'],
      ['Eid outfit ideas that are not the same as last year?', 'Change one thing, not everything. Same kurta, new dupatta. Same sharara, different colour top. A pathani with a textured waistcoat instead of plain. Pastels and ivory are the current Eid palette; add one piece of colour and one piece of shine. Photograph last year’s outfit first so you are not accidentally buying its twin.'],
      ['What do I wear to a sangeet or a mehendi?', 'Sangeet: anything you can dance in for four hours, in a colour that photographs under stage lights. Mehendi: sleeves you can push up, a hemline that will not drag through the henna, and shades of green, yellow or pink if you want to match the day. Both are daytime-to-evening events, so bring a layer.'],
      ['What should I wear for Onam or Pongal?', 'Onam calls for the kasavu saree or mundu, off-white with a gold border, and jasmine in the hair. Pongal is similar in spirit: a cotton or silk saree in bright colours, a veshti and shirt for men. Both are daytime, outdoor and warm, so natural fabrics and flat footwear.'],
      ['Christmas and New Year outfit ideas for India?', 'Christmas lunch wants warmth and a bit of red or green: a knit over a dress, a velvet shirt, a tartan something. New Year’s Eve wants shine: sequins, satin, metallic shoes. If you are going from one straight to the other, make the Christmas outfit the base and swap the top layer for the night.'],
      ['How do I avoid buying a new outfit for every festival?', 'Keep a festive capsule: two tops, two bottoms, one lehenga or one sherwani, three dupattas or stoles, and one pair of good juttis. Mix them. Recorded in a closet app with the dates you wore each one, you can see at a glance that the green kurta did Diwali and Eid last year and is due a rest, while the ivory one has not been out at all.'],
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping smarter',
    blurb: 'Buy less, wear more, stop buying the same thing twice.',
    qa: [
      ['How do I stop buying clothes I already own?', 'Look before you shop. The reason people own four navy jumpers is that in the store they cannot remember the other three. Photograph your closet once and search it from the shop floor: "navy jumper" should return your navy jumpers. Fluntr is built for exactly that moment.'],
      ['What is a capsule wardrobe and how do I build one?', 'A small set of pieces that all work together, usually 25 to 40, chosen so that any top goes with any bottom. Build it from what you have: lay everything out, keep the pieces you wore in the last three months, find the gaps (usually a neutral trouser and a good white shirt), and buy only those. A digital closet makes the laying-out step possible without covering the bed.'],
      ['Festival shopping on a budget: where should the money go?', 'One statement piece and nothing else. A single good lehenga, kurta set or sherwani in a colour you will wear again, then styling from what you own: last year’s dupatta, your everyday jewellery, shoes you already have. Tailoring an existing piece is cheaper than a new one and usually looks better.'],
      ['How do I know if a piece will go with the rest of my clothes before I buy it?', 'Check it against three things you already own, in your head or in your closet app: a bottom, a layer, shoes. If you cannot name three, it will sit in the cupboard. Fluntr lets you look at your closet while you are in the store, which is the whole point of having it on your phone.'],
      ['Is it worth buying expensive basics?', 'For the pieces you wear weekly, yes: a white shirt, dark denim, a black trouser, one good knit. Cost per wear is the only number that matters, and a shirt you wear sixty times a year is cheap at any price. For trend pieces, spend less. A wear log tells you which is which.'],
      ['How do I sell or give away clothes I do not wear?', 'Decide with data rather than guilt. Anything not worn in a year, that still fits, is a candidate. Sell on Poshmark-style apps or local resale, give to friends with the same size, donate the rest. Photographing your closet makes the "not worn in a year" list obvious instead of a weekend of trying things on.'],
    ],
  },
  {
    id: 'instagram-selfies',
    title: 'Instagram, selfies and fit checks',
    blurb: 'How to photograph what you are wearing so it looks the way it feels.',
    qa: [
      ['How do I take a good mirror selfie of my outfit?', 'Clean the mirror. Stand back far enough that your shoes are in frame. Hold the phone at chest height, slightly to one side, so it does not cover the outfit. Use the back camera if you can and tap to focus on your body, not the phone. Natural light from a window to the side beats any overhead bulb. Then take ten and keep one.'],
      ['What is a fit check and how do I post one?', 'A fit check is a photo or short video of your full outfit, usually with the pieces named. Shoot full length, name the brands or where you got each piece, and post it before you leave so people can actually react. Fluntr’s feed is built around this: every post can break down into the pieces behind it.'],
      ['How do I get outfit ideas from Instagram without copying someone?', 'Save the photo, then list the three things that make it work (the proportion, the colour pairing, the one odd piece). Recreate those three with your own clothes, not theirs. A closet app lets you search your wardrobe for the equivalents straight away.'],
      ['What does OOTD mean?', '"Outfit of the day": a photo of what you wore today, usually full length, usually with the pieces tagged. It started as a blog format and is now most of fashion Instagram. Posting one a day is also the fastest way to notice what you actually wear versus what you own.'],
      ['How do I ask friends which outfit to wear before going out?', 'Send both, not a description. Two photos side by side with a one-word caption gets you an answer in a minute; "the black one or the green one?" gets you questions. Fluntr lets you post two looks and let people pick, which is the same thing without the group chat.'],
      ['Best light for outfit photos at home?', 'Indirect daylight, from the side. Face a window at an angle, never with the window behind you. Switch off the ceiling light so there is only one light source. Late afternoon is kinder than noon. If you only have a bulb, bounce it off a white wall.'],
    ],
  },
  {
    id: 'organising',
    title: 'Organising your closet',
    blurb: 'Digital wardrobes, decluttering, and seeing everything at once.',
    qa: [
      ['What is a digital wardrobe app?', 'An app that keeps a photo of every piece of clothing you own, sorted by type, colour and occasion, so you can see your whole wardrobe on your phone, plan outfits from it and track what you wear. Fluntr is one: you photograph a piece, the background is removed on the phone, Kween fills in the category and colour, and it lands in your closet.'],
      ['How do I digitise my wardrobe quickly?', 'Do it in one afternoon, by category. Hang each piece on a plain wall or lay it on the bed, photograph it, move on. Do not fold, do not style. Forty pieces an hour is normal. Fluntr removes the backgrounds and sorts as you go, so by the end you have a usable closet, not a folder of photos.'],
      ['How should I organise my closet by colour, type or occasion?', 'Physically: by type, then by colour within type, because you reach for "a shirt" before you reach for "something blue". Digitally: all three, because the app can show any view. Occasion tags (work, wedding, beach) are the ones people forget to add and the ones they use most.'],
      ['How do I declutter clothes without regret?', 'Three piles: wore it this year, would wear it if it fit or was mended, have not touched it. Keep the first, fix the second within a month or let it go, release the third. The regret comes from deciding by memory; a wear log removes the guesswork.'],
      ['Can I keep track of what I wore and when?', 'Yes, and it is the most useful part of a closet app once you have used it a few weeks. Plan an outfit for a day, mark it worn, and the app remembers. You stop repeating the same look at the same event, and you see which pieces have not been out in months.'],
      ['Which is the best closet organiser app in India?', 'Several exist: Whering, Acloset, Cladwell, Indyx, Stylebook, and Fluntr. They differ on how much of the sorting you do yourself, whether they are built for Indian wardrobes (kurtas, sarees, lehengas, dupattas as first-class categories), and whether there is a social side. Fluntr is India-first, removes backgrounds on the phone rather than in the cloud, and lets you ask Kween, its stylist, for outfits from your own closet. It is in a waitlist stage, so compare on what matters to you.'],
    ],
  },
  {
    id: 'kween',
    title: 'Kween, the stylist',
    blurb: 'The pink plush with the bow. Short answers, from the clothes you own.',
    qa: [
      ['Who is Kween?', 'Fluntr’s mascot and stylist: a soft pink plush with a velvet bow who lives in your closet. She fills in category and colour when you add a piece, nudges you when something has not been worn for a while, and answers "what do I wear" with outfits from your own clothes. You can rename her and change her colour in the app.'],
      ['How is an AI stylist different from a shopping app?', 'A shopping app wants you to buy. A stylist that knows your closet wants you to wear. Kween only recommends from what you own, so the answer to "what goes with this" is always something in your cupboard, not something in a cart.'],
      ['Can Kween tell me what to wear for a specific event?', 'Yes. Tell her the occasion ("wedding on Saturday", "office, it is raining", "date, somewhere casual") and she pulls two or three outfits from your closet. The more of your wardrobe is photographed, the better the answers.'],
      ['Does Kween see my photos?', 'Background removal and categorising run on your phone. Your closet is private by default; you choose what to post and who sees it.'],
    ],
  },
  {
    id: 'fluntr',
    title: 'About Fluntr',
    blurb: 'What it is, what it costs, where it runs.',
    qa: [
      ['What is Fluntr?', 'Fluntr is a digital wardrobe and style app from India. You photograph the clothes you own, the app turns them into a closet you can see and search on your phone, plans outfits from it, and lets you post looks and ask friends which to wear. Kween, the in-app stylist, suggests outfits from your own clothes.'],
      ['Is Fluntr available now?', 'It is in a waitlist stage. Join the waitlist at fluntr.com and we will message you once, on the day it opens.'],
      ['Which phones does Fluntr work on?', 'It is built for iOS and Android. The web is for the waitlist, the demo and these pages.'],
      ['Is Fluntr free?', 'Joining the waitlist is free. Pricing for the app will be published when it opens; nothing on this site is a price promise.'],
      ['Is my wardrobe private on Fluntr?', 'Private by default. Background removal and categorising happen on your phone. You decide what to post and whether friends can see your closet. The privacy policy at fluntr.com/privacy says exactly what is collected and how to delete it.'],
      ['Who makes Fluntr?', 'Melchizedek Technologies Private Limited, India. Contact: support@fluntr.com.'],
      ['How do I get early access to Fluntr?', 'Join the waitlist on the home page. Early members are the people we build with, so expect to be asked what you think.'],
    ],
  },
]

export const slugOf = q => q.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

export const ALL_QA = TOPICS.flatMap(t => t.qa.map(([q, a]) => ({ q, a, slug: slugOf(q), topic: t.id, topicTitle: t.title })))
