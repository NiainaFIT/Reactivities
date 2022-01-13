using System.Linq;
using AutoMapper;

using Domain;
using Application.Activities;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity,Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.HostUsername, opt => opt.MapFrom(src => src.Attendees
                    .FirstOrDefault(x=>x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.AppUser.Bio))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}