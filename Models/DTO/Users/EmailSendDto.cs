using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OKPBackend.Models.DTO.Users
{
    public class EmailSendDto
    {

        public EmailSendDto(string To, string Subject, string Body)
        {
            this.To = To;
            this.Subject = Subject;
            this.Body = Body;
        }


        public string To { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }
    }
}