// import * as nodemailer from 'nodemailer';
// import sesTransport from 'nodemailer-ses-transport';
//
// export function createTransporter() {
//     // Create a new transporter with your email service provider's configuration
//     const transporter = nodemailer.createTransport(
//         sesTransport({
//             host: 'email-smtp.us-west-2.amazonaws.com',
//             port: 465,
//             secure: true,
//             auth: {
//               user: 'AKIA4KBMSOOQARUEPEN4',
//               pass: 'BPtORVjNB7o9FamWP877jhiYn9QFTBx2Ve6UE4CpevwS',
//             },
//         })
//     );
//
//     return transporter;
// }
//
// export function formMailOptions(from: string, to: string, subject: string, text: string) {
//   const mailOptions = {
//     from: from,
//     to: to,
//     subject: subject,
//     text: text
//   };
//   return mailOptions;
// }
//
// export async function sendEmail(transporter: nodemailer.Transporter, mailOptions)  {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log(`Email sent: ${info.response}`);
//       }
//     });
// }
